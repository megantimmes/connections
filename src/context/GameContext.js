// src/context/GameContext.js
// ─────────────────────────────────────────────────────────────
// Central state for the entire app. Handles:
//   - User identity (anonymous Firebase UID)
//   - Current puzzle + index
//   - Selection, guess history, mistakes
//   - Transition between PLAYING → SURVEY → NEXT PUZZLE
// ─────────────────────────────────────────────────────────────
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import PUZZLES from "../data/puzzles";
import {
  getUserProgress,
  advanceUserProgress,
  initGameplaySession,
  recordGuess,
  completeGameplay,
  saveSurveyResponse,
} from "../utils/firebaseService";
import { buildWordTiles, validateGuess } from "../utils/gameLogic";

export const MAX_MISTAKES = 4;

// ── State Shape ───────────────────────────────────────────────
const initialState = {
  // Auth
  userId: null,
  authLoading: true,

  // Progress
  currentPuzzleIndex: 0,
  allComplete: false,

  // Current puzzle session
  puzzle: null,
  tiles: [],
  selectedWords: [],
  solvedGroups: [],      // { category, color, words[] }
  mistakeCount: 0,
  guessHistory: [],      // { words[], correct, category }
  gameStatus: "idle",    // idle | playing | won | lost | survey | done

  // Timer
  startTime: null,
  elapsedMs: 0,

  // UI feedback
  shake: false,
  oneAway: false,
  message: null,
};

// ── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userId: action.userId, authLoading: false };
    case "LOAD_PUZZLE":
      return {
        ...state,
        puzzle: action.puzzle,
        tiles: action.tiles,
        selectedWords: [],
        solvedGroups: action.solvedGroups || [],
        mistakeCount: action.mistakeCount || 0,
        guessHistory: action.guessHistory || [],
        gameStatus: action.gameStatus || "playing",
        startTime: Date.now(),
        elapsedMs: 0,
        shake: false,
        oneAway: false,
        message: null,
      };
    case "SET_PROGRESS":
      return {
        ...state,
        currentPuzzleIndex: action.index,
        allComplete: action.index >= PUZZLES.length,
      };
    case "TOGGLE_WORD": {
      const { word } = action;
      const already = state.selectedWords.includes(word);
      if (already) {
        return { ...state, selectedWords: state.selectedWords.filter((w) => w !== word), oneAway: false };
      }
      if (state.selectedWords.length >= 4) return state;
      return { ...state, selectedWords: [...state.selectedWords, word], oneAway: false };
    }
    case "SUBMIT_GUESS_CORRECT": {
      const { category, color, words } = action;
      const newSolvedGroups = [...state.solvedGroups, { category, color, words }];
      const remainingTiles = state.tiles.filter((t) => !words.includes(t.word));
      const won = newSolvedGroups.length === state.puzzle.groups.length;
      return {
        ...state,
        selectedWords: [],
        solvedGroups: newSolvedGroups,
        tiles: remainingTiles,
        guessHistory: [...state.guessHistory, { words, correct: true, category }],
        gameStatus: won ? "won" : "playing",
        message: won ? "Brilliant! You got them all!" : `✓ ${category}`,
        shake: false,
        oneAway: false,
      };
    }
    case "SUBMIT_GUESS_WRONG": {
      const newMistakeCount = state.mistakeCount + 1;
      const lost = newMistakeCount >= MAX_MISTAKES;
      return {
        ...state,
        guessHistory: [
          ...state.guessHistory,
          { words: action.words, correct: false, category: null },
        ],
        mistakeCount: newMistakeCount,
        gameStatus: lost ? "lost" : "playing",
        shake: true,
        oneAway: action.oneAway,
        message: action.oneAway ? "One away…" : lost ? "No more attempts." : "Not quite!",
      };
    }
    case "CLEAR_SHAKE":
      return { ...state, shake: false };
    case "CLEAR_MESSAGE":
      return { ...state, message: null };
    case "REVEAL_ALL":
      // Used when game is lost — show all groups
      return {
        ...state,
        solvedGroups: state.puzzle.groups.map((g) => ({
          category: g.category,
          color: g.color,
          words: g.words,
        })),
        tiles: [],
      };
    case "TICK":
      return { ...state, elapsedMs: Date.now() - state.startTime };
    case "GO_TO_SURVEY":
      return { ...state, gameStatus: "survey" };
    case "GO_TO_NEXT":
      return { ...state, gameStatus: "idle" };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (state.gameStatus === "playing") {
      timerRef.current = setInterval(() => dispatch({ type: "TICK" }), 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.gameStatus]);

  // Auth — sign in anonymously to get a stable userId
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: "SET_USER", userId: user.uid });
      } else {
        const cred = await signInAnonymously(auth);
        dispatch({ type: "SET_USER", userId: cred.user.uid });
      }
    });
    return unsub;
  }, []);

  // Load progress once userId is available
  useEffect(() => {
    if (!state.userId) return;
    (async () => {
      const progress = await getUserProgress(state.userId);
      const idx = Math.min(progress.currentPuzzleIndex, PUZZLES.length);
      dispatch({ type: "SET_PROGRESS", index: idx });
      if (idx < PUZZLES.length) {
        await loadPuzzle(state.userId, idx);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.userId]);

  const loadPuzzle = useCallback(async (userId, index) => {
    const puzzle = PUZZLES[index];
    if (!puzzle) return;
    const session = await initGameplaySession(userId, puzzle.id);
    // Reconstruct solved groups from session
    const solvedGroups = (session.correctGroups || []).map((cat) => {
      const g = puzzle.groups.find((gr) => gr.category === cat);
      return g ? { category: g.category, color: g.color, words: g.words } : null;
    }).filter(Boolean);
    const solvedWords = new Set(solvedGroups.flatMap((g) => g.words));
    const allTiles = buildWordTiles(puzzle).filter((t) => !solvedWords.has(t.word));

    dispatch({
      type: "LOAD_PUZZLE",
      puzzle,
      tiles: allTiles,
      solvedGroups,
      mistakeCount: session.mistakeCount || 0,
      guessHistory: session.attempts || [],
      gameStatus: session.completedAt ? "survey" : "playing",
    });
  }, []);

  // Actions exposed to components
  const toggleWord = useCallback((word) => {
    dispatch({ type: "TOGGLE_WORD", word });
  }, []);

  const submitGuess = useCallback(async () => {
    const { selectedWords, puzzle, userId } = state;
    if (selectedWords.length !== 4) return;

    const result = validateGuess(selectedWords, puzzle);

    if (result.correct) {
      dispatch({
        type: "SUBMIT_GUESS_CORRECT",
        category: result.category,
        color: result.color,
        words: selectedWords,
      });
      await recordGuess(userId, puzzle.id, {
        words: selectedWords,
        correct: true,
        category: result.category,
      });

      // Check win after dispatch settles
      setTimeout(async () => {
        const newSolvedCount = state.solvedGroups.length + 1;
        if (newSolvedCount >= puzzle.groups.length) {
          await completeGameplay(userId, puzzle.id, state.elapsedMs, true);
          setTimeout(() => dispatch({ type: "GO_TO_SURVEY" }), 1500);
        }
      }, 0);
    } else {
      dispatch({
        type: "SUBMIT_GUESS_WRONG",
        words: selectedWords,
        oneAway: result.oneAway,
      });
      await recordGuess(userId, puzzle.id, {
        words: selectedWords,
        correct: false,
        category: null,
      });

      // Shake then clear
      setTimeout(() => dispatch({ type: "CLEAR_SHAKE" }), 600);
      setTimeout(() => dispatch({ type: "CLEAR_MESSAGE" }), 2000);

      const newMistakes = state.mistakeCount + 1;
      if (newMistakes >= MAX_MISTAKES) {
        dispatch({ type: "REVEAL_ALL" });
        await completeGameplay(userId, puzzle.id, state.elapsedMs, false);
        setTimeout(() => dispatch({ type: "GO_TO_SURVEY" }), 2000);
      }
    }
  }, [state]);

  const submitSurvey = useCallback(async (responses) => {
    console.log("submitSurvey called with:", responses);
    const { userId, puzzle, currentPuzzleIndex} = state;
    await saveSurveyResponse(userId, puzzle.id, responses);
    const nextIndex = currentPuzzleIndex + 1;
    await advanceUserProgress(userId, puzzle.id, nextIndex);
    dispatch({ type: "SET_PROGRESS", index: nextIndex });

    if (nextIndex >= PUZZLES.length) {
      dispatch({ type: "GO_TO_NEXT" }); // allComplete will be true
    } else {
      dispatch({ type: "GO_TO_NEXT" });
      await loadPuzzle(userId, nextIndex);
    }
  }, [state, loadPuzzle]);

  const deselectAll = useCallback(() => {
    dispatch({ type: "LOAD_PUZZLE",
      puzzle: state.puzzle,
      tiles: state.tiles,
      solvedGroups: state.solvedGroups,
      mistakeCount: state.mistakeCount,
      guessHistory: state.guessHistory,
      gameStatus: state.gameStatus,
    });
  }, [state]);

  const shuffleTiles = useCallback(() => {
    const shuffled = [...state.tiles].sort(() => Math.random() - 0.5);
    dispatch({ type: "LOAD_PUZZLE",
      puzzle: state.puzzle,
      tiles: shuffled,
      solvedGroups: state.solvedGroups,
      mistakeCount: state.mistakeCount,
      guessHistory: state.guessHistory,
      gameStatus: state.gameStatus,
    });
  }, [state]);

  return (
    <GameContext.Provider
      value={{
        state,
        totalPuzzles: PUZZLES.length,
        toggleWord,
        submitGuess,
        submitSurvey,
        deselectAll,
        shuffleTiles,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

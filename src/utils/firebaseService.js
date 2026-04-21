// src/utils/firebaseService.js
// ─────────────────────────────────────────────────────────────
// All Firestore read/write operations in one place.
// Schema:
//   /puzzles/{puzzleId}                     — puzzle definitions
//   /users/{userId}/gameplay/{puzzleId}     — per-puzzle gameplay data
//   /users/{userId}/surveys/{puzzleId}      — per-puzzle survey responses
//   /users/{userId}/progress               — overall progress doc
// ─────────────────────────────────────────────────────────────
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// ── Puzzles ───────────────────────────────────────────────────

/** Seed all puzzles into Firestore (run once during setup) */
export async function seedPuzzles(puzzlesArray) {
  const batch = puzzlesArray.map((puzzle) =>
    setDoc(doc(db, "puzzles", puzzle.id), puzzle)
  );
  await Promise.all(batch);
}

/** Fetch a single puzzle by ID */
export async function fetchPuzzle(puzzleId) {
  const snap = await getDoc(doc(db, "puzzles", puzzleId));
  return snap.exists() ? snap.data() : null;
}

/** Fetch all puzzles (ordered by title on the client) */
export async function fetchAllPuzzles() {
  const snap = await getDocs(collection(db, "puzzles"));
  return snap.docs.map((d) => d.data());
}

// ── User Progress ─────────────────────────────────────────────

/** Get or create the user's progress document */
export async function getUserProgress(userId) {
  const ref = doc(db, "users", userId, "meta", "progress");
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const initial = { currentPuzzleIndex: 0, completedPuzzles: [] };
  await setDoc(ref, initial);
  return initial;
}

/** Advance the user to the next puzzle */
export async function advanceUserProgress(userId, completedPuzzleId, nextIndex) {
  const ref = doc(db, "users", userId, "meta", "progress");
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : { completedPuzzles: [] };
  await setDoc(ref, {
    currentPuzzleIndex: nextIndex,
    completedPuzzles: [...(existing.completedPuzzles || []), completedPuzzleId],
    updatedAt: serverTimestamp(),
  });
}

// ── Gameplay Data ─────────────────────────────────────────────

/** Initialize a gameplay session when a puzzle starts */
export async function initGameplaySession(userId, puzzleId) {
  const ref = doc(db, "users", userId, "gameplay", puzzleId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data(); // Resume existing session
  const initial = {
    puzzleId,
    startedAt: serverTimestamp(),
    completedAt: null,
    solved: false,
    attempts: [],           // array of { words[], correct, timestamp }
    correctGroups: [],      // categories solved in order
    mistakeCount: 0,
    timeSpentMs: null,
  };
  await setDoc(ref, initial);
  return initial;
}

/** Record a single guess attempt */
export async function recordGuess(userId, puzzleId, attempt) {
  // attempt: { words: string[], correct: boolean, category: string|null }
  const ref = doc(db, "users", userId, "gameplay", puzzleId);
  const snap = await getDoc(ref);
  const data = snap.data();
  const updatedAttempts = [
    ...(data.attempts || []),
    { ...attempt, timestamp: new Date().toISOString() },
  ];
  const updatedCorrectGroups = attempt.correct
    ? [...(data.correctGroups || []), attempt.category]
    : data.correctGroups || [];

  await updateDoc(ref, {
    attempts: updatedAttempts,
    correctGroups: updatedCorrectGroups,
    mistakeCount: attempt.correct ? data.mistakeCount : data.mistakeCount + 1,
  });
}

/** Mark a puzzle as complete and record elapsed time */
export async function completeGameplay(userId, puzzleId, timeSpentMs, solved) {
  const ref = doc(db, "users", userId, "gameplay", puzzleId);
  await updateDoc(ref, {
    completedAt: serverTimestamp(),
    solved,
    timeSpentMs,
  });
}

/** Fetch existing gameplay session (used for resume) */
export async function fetchGameplaySession(userId, puzzleId) {
  const ref = doc(db, "users", userId, "gameplay", puzzleId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ── Survey Responses ──────────────────────────────────────────

/** Save survey response for a given puzzle */
export async function saveSurveyResponse(userId, puzzleId, responses) {
  const ref = doc(db, "users", userId, "surveys", puzzleId);
  try {
    await setDoc(ref, {
      puzzleId,
      responses,
      submittedAt: serverTimestamp(),
    });
    console.log("Survey saved successfully!");

    // Read it back immediately to confirm it exists
    const check = await getDoc(ref);
    console.log("Read back from Firestore:", check.exists(), check.data());
  } catch (error) {
    console.error("Survey save error:", error);
  }
}

/** Check whether user already submitted survey for a puzzle */
export async function hasSurveyResponse(userId, puzzleId) {
  const ref = doc(db, "users", userId, "surveys", puzzleId);
  const snap = await getDoc(ref);
  return snap.exists();
}

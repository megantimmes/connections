// src/utils/gameLogic.js
// ─────────────────────────────────────────────────────────────
// Pure functions for guess validation and puzzle state helpers.
// ─────────────────────────────────────────────────────────────

/** Flatten a puzzle's groups into a shuffled array of word objects */
export function buildWordTiles(puzzle) {
  const tiles = puzzle.groups.flatMap((group) =>
    group.words.map((word) => ({
      word,
      category: group.category,
      color: group.color,
    }))
  );
  return shuffleArray(tiles);
}

/** Seeded Fisher-Yates shuffle (deterministic per puzzle for reproducibility) */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Validate a guess of 4 words against the puzzle.
 * Returns: { correct: boolean, category: string|null, color: string|null, oneAway: boolean }
 */
export function validateGuess(selectedWords, puzzle) {
  for (const group of puzzle.groups) {
    const groupSet = new Set(group.words);
    const selectedSet = new Set(selectedWords);
    const intersection = [...selectedSet].filter((w) => groupSet.has(w));

    if (intersection.length === 4) {
      return { correct: true, category: group.category, color: group.color, oneAway: false };
    }
    if (intersection.length === 3) {
      // Might be "one away"
      return { correct: false, category: null, color: null, oneAway: true };
    }
  }
  return { correct: false, category: null, color: null, oneAway: false };
}

/** Check if the puzzle is fully solved */
export function isPuzzleSolved(solvedCategories, puzzle) {
  return solvedCategories.length === puzzle.groups.length;
}

/** Check if max mistakes reached */
export function isGameOver(mistakeCount, maxMistakes) {
  return mistakeCount >= maxMistakes;
}

/** Get color hex / tailwind class for a group color */
export const GROUP_COLORS = {
  yellow: { bg: "#F9DF6D", text: "#1a1a1a", label: "Easy" },
  green:  { bg: "#A0C35A", text: "#1a1a1a", label: "Medium" },
  blue:   { bg: "#B0C4EF", text: "#1a1a1a", label: "Hard" },
  purple: { bg: "#BA81C5", text: "#ffffff", label: "Tricky" },
};

/** Format elapsed milliseconds as MM:SS */
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

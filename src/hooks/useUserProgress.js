// src/hooks/useUserProgress.js
// ─────────────────────────────────────────────────────────────
// Thin hook that wraps the Firebase progress helpers so
// components can subscribe to loading / error states cleanly.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { getUserProgress, advanceUserProgress } from "../utils/firebaseService";

export default function useUserProgress(userId) {
  const [progress, setProgress]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserProgress(userId)
      .then((p) => setProgress(p))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [userId]);

  const advance = async (completedPuzzleId, nextIndex) => {
    await advanceUserProgress(userId, completedPuzzleId, nextIndex);
    setProgress((prev) => ({
      ...prev,
      currentPuzzleIndex: nextIndex,
      completedPuzzles: [...(prev?.completedPuzzles ?? []), completedPuzzleId],
    }));
  };

  return { progress, loading, error, advance };
}

// src/hooks/useTimer.js
// ─────────────────────────────────────────────────────────────
// Standalone timer hook — can be used independently of context
// if you want per-component timing outside GameContext.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";

export default function useTimer(autoStart = false) {
  const [elapsedMs, setElapsedMs]   = useState(0);
  const [running, setRunning]       = useState(autoStart);
  const startTimeRef                = useRef(null);
  const intervalRef                 = useRef(null);

  const start = useCallback(() => {
    startTimeRef.current = Date.now() - elapsedMs;
    setRunning(true);
  }, [elapsedMs]);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsedMs(0);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (running) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return { elapsedMs, running, start, pause, reset };
}

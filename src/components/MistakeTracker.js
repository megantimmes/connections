// src/components/MistakeTracker.js
import React from "react";
import { MAX_MISTAKES } from "../context/GameContext";

export default function MistakeTracker({ mistakeCount }) {
  const remaining = MAX_MISTAKES - mistakeCount;
  return (
    <div className="mistake-tracker">
      <span className="mistake-tracker__label">Mistakes remaining:</span>
      <div className="mistake-tracker__dots">
        {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
          <div
            key={i}
            className={`mistake-dot ${i < remaining ? "mistake-dot--active" : "mistake-dot--used"}`}
          />
        ))}
      </div>
    </div>
  );
}

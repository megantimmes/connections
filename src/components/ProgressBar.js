// src/components/ProgressBar.js
import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="progress-bar-label">
        Puzzle {Math.min(current + 1, total)} of {total}
      </span>
    </div>
  );
}

// src/components/WordTile.js
import React from "react";

export default function WordTile({ word, selected, disabled, onClick, solved, color, bgColor }) {
  if (solved) {
    return (
      <div
        className="word-tile word-tile--solved"
        style={{ backgroundColor: bgColor }}
      >
        {word}
      </div>
    );
  }

  return (
    <button
      className={`word-tile ${selected ? "word-tile--selected" : ""} ${disabled ? "word-tile--disabled" : ""}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-pressed={selected}
    >
      {word}
    </button>
  );
}

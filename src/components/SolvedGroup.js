// src/components/SolvedGroup.js
import React from "react";
import { GROUP_COLORS } from "../utils/gameLogic";

export default function SolvedGroup({ group }) {
  const palette = GROUP_COLORS[group.color] || GROUP_COLORS.yellow;
  return (
    <div
      className="solved-group"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <span className="solved-group__category">{group.category}</span>
      <span className="solved-group__words">{group.words.join(", ")}</span>
    </div>
  );
}

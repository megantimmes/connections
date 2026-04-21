// src/components/PuzzleBoard.js
import React, { useEffect } from "react";
import { useGame } from "../context/GameContext";
import WordTile from "./WordTile";
import SolvedGroup from "./SolvedGroup";
import MistakeTracker from "./MistakeTracker";
import { GROUP_COLORS, formatTime } from "../utils/gameLogic";

export default function PuzzleBoard() {
  const {
    state,
    totalPuzzles,
    toggleWord,
    submitGuess,
    deselectAll,
    shuffleTiles,
  } = useGame();

  const {
    puzzle,
    tiles,
    selectedWords,
    solvedGroups,
    mistakeCount,
    gameStatus,
    shake,
    oneAway,
    message,
    elapsedMs,
  } = state;

  if (!puzzle) return <div className="loading">Loading puzzle…</div>;

  const canSubmit = selectedWords.length === 4 && gameStatus === "playing";
  const isPlaying = gameStatus === "playing";

  return (
    <div className="puzzle-board">
      {/* Header */}
      <div className="board-header">
        <h2 className="board-title">Create four groups of four!</h2>
        <div className="board-timer">{formatTime(elapsedMs)}</div>
      </div>

      {/* Message toast */}
      {message && (
        <div className={`message-toast ${oneAway ? "message-toast--oneaway" : ""}`}>
          {message}
        </div>
      )}

      {/* Solved groups */}
      <div className="solved-groups">
        {solvedGroups.map((group) => (
          <SolvedGroup key={group.category} group={group} />
        ))}
      </div>

      {/* Remaining tiles */}
      {tiles.length > 0 && (
        <div className={`tile-grid ${shake ? "tile-grid--shake" : ""}`}>
          {tiles.map(({ word }) => (
            <WordTile
              key={word}
              word={word}
              selected={selectedWords.includes(word)}
              disabled={!isPlaying}
              onClick={() => toggleWord(word)}
            />
          ))}
        </div>
      )}

      {/* Game-over reveal — all groups shown in solved area */}
      {gameStatus === "lost" && tiles.length === 0 && solvedGroups.length === puzzle.groups.length && (
        <p className="game-over-msg">Better luck next time! Showing all answers above.</p>
      )}

      {/* Controls */}
      {isPlaying && (
        <div className="board-controls">
          <button className="btn btn--ghost" onClick={shuffleTiles}>Shuffle</button>
          <button
            className="btn btn--ghost"
            onClick={deselectAll}
            disabled={selectedWords.length === 0}
          >
            Deselect All
          </button>
          <button
            className="btn btn--primary"
            onClick={submitGuess}
            disabled={!canSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {/* Mistakes */}
      <MistakeTracker mistakeCount={mistakeCount} />

      {/* Won state CTA */}
      {(gameStatus === "won") && (
        <div className="status-banner status-banner--win">
          <p>🎉 Solved in {formatTime(elapsedMs)}!</p>
          <p className="status-sub">Moving to the survey…</p>
        </div>
      )}

      {/* Lost state CTA */}
      {gameStatus === "lost" && (
        <div className="status-banner status-banner--loss">
          <p>Out of attempts.</p>
          <p className="status-sub">Moving to the survey…</p>
        </div>
      )}
    </div>
  );
}

// src/App.js
import React from "react";
import { GameProvider, useGame } from "./context/GameContext";
import PuzzleBoard from "./components/PuzzleBoard";
import SurveyForm from "./components/SurveyForm";
import ProgressBar from "./components/ProgressBar";
import AllComplete from "./components/AllComplete";
import "./styles.css";
import DataViewer from "./components/DataViewer";

// then inside GameShell, add it anywhere temporarily:


function GameShell() {
  const { state, totalPuzzles } = useGame();
  const { authLoading, gameStatus, allComplete, currentPuzzleIndex } = state;

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Setting up…</p>
      </div>
    );
  }

  if (allComplete) {
    return (
      <main className="app-main">
        <AllComplete />
      </main>
    );
  }
  
  return (
    <main className="app-main">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-dot logo-dot--y" />
          <span className="logo-dot logo-dot--g" />
          <span className="logo-dot logo-dot--b" />
          <span className="logo-dot logo-dot--p" />
          <h1>Connections</h1>
        </div>
        <ProgressBar current={currentPuzzleIndex} total={totalPuzzles} />
      </header>

      <div className="app-content">
        {gameStatus === "survey" ? <SurveyForm /> : <PuzzleBoard />}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}

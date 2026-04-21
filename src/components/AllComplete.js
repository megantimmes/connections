// src/components/AllComplete.js
import React from "react";

export default function AllComplete() {
  return (
    <div className="all-complete">
      <div className="all-complete__confetti" aria-hidden="true">
        {["🎉","✨","🏆","🎊","⭐","🎈"].map((e, i) => (
          <span key={i} className="confetti-piece" style={{ "--i": i }}>{e}</span>
        ))}
      </div>
      <div className="all-complete__card">
        <h1 className="all-complete__title">All Done!</h1>
        <p className="all-complete__subtitle">
          You've completed all 10 puzzles. Thanks for playing!
        </p>
        <p className="all-complete__note">
          Your gameplay data and survey responses have been saved.
        </p>
      </div>
    </div>
  );
}

// src/components/SurveyForm.js
import React, { useState } from "react";
import surveySchema from "../config/surveySchema";
import { useGame } from "../context/GameContext";

function StarRating({ id, value, onChange, labels }) {
  return (
    <div className="star-rating" role="group" aria-labelledby={`${id}-label`}>
      {labels?.low && <span className="rating-label">{labels.low}</span>}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${value >= n ? "star--filled" : ""}`}
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      {labels?.high && <span className="rating-label">{labels.high}</span>}
    </div>
  );
}

export default function SurveyForm() {
  const { submitSurvey, state } = useGame();
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const validate = () => {
    const newErrors = {};
    surveySchema.forEach((field) => {
      if (field.required && !responses[field.id]) {
        newErrors[field.id] = "This field is required.";
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    await submitSurvey(responses);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="survey-complete">
        <div className="survey-complete__icon">✓</div>
        <h3>Thanks for your feedback!</h3>
        <p>Loading next puzzle…</p>
      </div>
    );
  }

  return (
    <div className="survey-form">
      <div className="survey-header">
        <div className="survey-badge">Survey</div>
        <h2 className="survey-title">How did that go?</h2>
        <p className="survey-subtitle">
          Puzzle {state.currentPuzzleIndex + 1} complete — just a few quick questions.
        </p>
      </div>

      <div className="survey-fields">
        {surveySchema.map((field) => (
          <div key={field.id} className="survey-field">
            <label className="survey-field__label" id={`${field.id}-label`}>
              {field.label}
              {field.required && <span className="required-star"> *</span>}
            </label>

            {field.type === "rating" && (
              <StarRating
                id={field.id}
                value={responses[field.id] || 0}
                onChange={(v) => handleChange(field.id, v)}
                labels={field.labels}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                className="survey-textarea"
                placeholder={field.placeholder}
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                rows={3}
              />
            )}

            {field.type === "radio" && (
              <div className="survey-radio-group" role="radiogroup">
                {field.options.map((opt) => (
                  <label key={opt} className="survey-radio">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={responses[field.id] === opt}
                      onChange={() => handleChange(field.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "select" && (
              <select
                className="survey-select"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select…</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {errors[field.id] && (
              <span className="survey-error">{errors[field.id]}</span>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn btn--primary btn--full"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Saving…" : "Submit & Continue →"}
      </button>
    </div>
  );
}

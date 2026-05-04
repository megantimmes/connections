// src/config/surveySchema.js
// ─────────────────────────────────────────────────────────────
// Edit this file to change survey questions without touching
// any component code. Each field supports: text, textarea,
// rating (1-5 stars), select, and radio types.
// ─────────────────────────────────────────────────────────────

const surveySchema = [
  {
    id: "difficulty",
    label: "How difficult was this puzzle?",
    type: "rating",
    required: true,
    labels: { low: "Very Easy", high: "Very Hard"},
  },
  {
    id: "preference",
    label: "How much did you enjoy this puzzle?",
    type: "rating",
    required: true,
    labels: { low: "Not at all", high: "Loved it" },
  },
   {
    id: "creativity",
    label: "Was this puzzle fun and unique?",
    type: "rating",
    required: true,
    labels: { low: "Not at all", high: "Very unique" },
  },
   {
    id: "fairness",
    label: "Was this puzzle fair?",
    type: "rating",
    required: true,
    labels: { low: "Really obscure", high: "Completely fair" },
  },,
  {
    id: "overall_feedback",
    label: "Any other thoughts on this puzzle?",
    type: "textarea",
    required: false,
    placeholder: "Share anything you'd like...",
  },
];

export default surveySchema;

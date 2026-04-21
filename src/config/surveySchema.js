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
    labels: { low: "Very Easy", high: "Very Hard" },
  },
  {
    id: "enjoyment",
    label: "How much did you enjoy this puzzle?",
    type: "rating",
    required: true,
    labels: { low: "Not at all", high: "Loved it" },
  },
  {
    id: "strategy",
    label: "What strategy did you use?",
    type: "radio",
    required: false,
    options: [
      "I started with what I was most certain about",
      "I tried to find the trickiest group first",
      "I guessed randomly and adjusted",
      "I looked for word patterns or themes",
      "Other",
    ],
  },
  {
    id: "confusing_words",
    label: "Were any words confusing or misleading? If so, which ones?",
    type: "textarea",
    required: false,
    placeholder: "e.g. 'BASS could have gone in two groups...'",
  },
  {
    id: "overall_feedback",
    label: "Any other thoughts on this puzzle?",
    type: "textarea",
    required: false,
    placeholder: "Share anything you'd like...",
  },
];

export default surveySchema;

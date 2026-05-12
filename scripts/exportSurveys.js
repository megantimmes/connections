// scripts/exportSurveys.js
// ─────────────────────────────────────────────────────────────
// Exports survey responses from Firestore to two CSV files:
//   survey_responses.csv  — one row per submission (raw data)
//   survey_summary.csv    — mean scores grouped by puzzle type
//                           and by individual puzzle
//
// Usage: node scripts/exportSurveys.js
// ─────────────────────────────────────────────────────────────

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? undefined
  : require("./serviceAccountKey.json");

admin.initializeApp({
  credential: serviceAccount
    ? admin.credential.cert(serviceAccount)
    : admin.credential.applicationDefault(),
  projectId: "connections-puzzle",
});

const db = admin.firestore();

const PUZZLE_META = {
  puzzle_01_nyt:   { number: 1, type: "nyt" },
  puzzle_02_multi: { number: 2, type: "multi" },
  puzzle_03_gpt:   { number: 3, type: "gpt" },
  puzzle_04_nyt:   { number: 4, type: "nyt" },
  puzzle_05_multi: { number: 5, type: "multi" },
  puzzle_06_gpt:   { number: 6, type: "gpt" },
  puzzle_07_nyt:   { number: 7, type: "nyt" },
  puzzle_08_multi: { number: 8, type: "multi" },
};

const SCORE_FIELDS = ["difficulty", "preference", "creativity", "fairness"];

function escapeCell(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  return str.includes(",") || str.includes('"') || str.includes("\n")
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

function rowToCsv(values) {
  return values.map(escapeCell).join(",");
}

function mean(arr) {
  if (!arr.length) return "";
  return (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2);
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const k = row[key];
    (acc[k] = acc[k] || []).push(row);
    return acc;
  }, {});
}

function buildSummaryRows(rows) {
  const summaryRows = [];

  // ── By puzzle type ───────────────────────────────────────────
  summaryRows.push(["GROUP", "N", ...SCORE_FIELDS]);
  summaryRows.push(["--- By Type ---"]);

  const byType = groupBy(rows, "puzzle_type");
  for (const type of ["nyt", "multi", "gpt"]) {
    const group = byType[type] || [];
    summaryRows.push([
      type,
      group.length,
      ...SCORE_FIELDS.map((f) => mean(group.map((r) => r[f]).filter((v) => v !== ""))),
    ]);
  }

  // ── By individual puzzle ─────────────────────────────────────
  summaryRows.push([]);
  summaryRows.push(["--- By Puzzle ---"]);
  summaryRows.push(["GROUP", "N", ...SCORE_FIELDS]);

  const byPuzzle = groupBy(rows, "puzzle_id");
  const puzzleIds = Object.keys(byPuzzle).sort((a, b) => {
    const na = (PUZZLE_META[a] || {}).number || 0;
    const nb = (PUZZLE_META[b] || {}).number || 0;
    return na - nb;
  });

  for (const puzzleId of puzzleIds) {
    const group = byPuzzle[puzzleId];
    const meta = PUZZLE_META[puzzleId] || {};
    summaryRows.push([
      `${puzzleId} (${meta.type || "unknown"})`,
      group.length,
      ...SCORE_FIELDS.map((f) => mean(group.map((r) => r[f]).filter((v) => v !== ""))),
    ]);
  }

  return summaryRows;
}

async function run() {
  console.log("Fetching surveys from Firestore…");

  const snap = await db.collection("surveys").get();

  if (snap.empty) {
    console.log("No survey documents found in /surveys collection.");
    process.exit(0);
  }

  console.log(`Found ${snap.size} response(s).`);

  const rows = snap.docs.map((doc) => {
    const d = doc.data();
    const meta = PUZZLE_META[d.puzzleId] || {};
    const submittedAt = d.submittedAt
      ? d.submittedAt.toDate().toISOString()
      : "";

    return {
      response_id:   doc.id,
      user_id:       d.userId || "",
      puzzle_id:     d.puzzleId || "",
      puzzle_type:   meta.type || "unknown",
      puzzle_number: meta.number || "",
      difficulty:    d.responses?.difficulty ?? "",
      preference:    d.responses?.preference ?? "",
      creativity:    d.responses?.creativity ?? "",
      fairness:      d.responses?.fairness ?? "",
      overall_feedback: d.responses?.overall_feedback || "",
      submitted_at:  submittedAt,
    };
  });

  // Sort by puzzle number, then submission time
  rows.sort((a, b) => {
    if (a.puzzle_number !== b.puzzle_number) return a.puzzle_number - b.puzzle_number;
    return a.submitted_at.localeCompare(b.submitted_at);
  });

  // ── survey_responses.csv ─────────────────────────────────────
  const responseHeaders = [
    "response_id", "user_id", "puzzle_id", "puzzle_type", "puzzle_number",
    "difficulty", "preference", "creativity", "fairness",
    "overall_feedback", "submitted_at",
  ];

  const responseLines = [
    rowToCsv(responseHeaders),
    ...rows.map((r) => rowToCsv(responseHeaders.map((h) => r[h]))),
  ];

  const responsesPath = path.join(__dirname, "survey_responses.csv");
  fs.writeFileSync(responsesPath, responseLines.join("\n"), "utf8");
  console.log(`Wrote ${responsesPath}`);

  // ── survey_summary.csv ───────────────────────────────────────
  const summaryRows = buildSummaryRows(rows);
  const summaryLines = summaryRows.map(rowToCsv);

  const summaryPath = path.join(__dirname, "survey_summary.csv");
  fs.writeFileSync(summaryPath, summaryLines.join("\n"), "utf8");
  console.log(`Wrote ${summaryPath}`);

  process.exit(0);
}

run().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});

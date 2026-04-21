# Connections Puzzle App

A full-stack NYT Connections-style puzzle experience built with React and Firebase.

---

## Project Structure

```
connections-app/
├── public/
│   └── index.html
├── scripts/
│   └── seedPuzzles.js          # One-time Firestore seeder
├── src/
│   ├── config/
│   │   ├── firebase.js         # Firebase SDK init (uses env vars)
│   │   └── surveySchema.js     # ✏️  Edit survey questions here
│   ├── context/
│   │   └── GameContext.js      # Central state + all game actions
│   ├── components/
│   │   ├── PuzzleBoard.js      # Main game board
│   │   ├── WordTile.js         # Individual word button
│   │   ├── SolvedGroup.js      # Revealed group row
│   │   ├── MistakeTracker.js   # Remaining mistakes dots
│   │   ├── ProgressBar.js      # Puzzle N of 10 indicator
│   │   ├── SurveyForm.js       # Post-puzzle survey
│   │   └── AllComplete.js      # End screen
│   ├── data/
│   │   └── puzzles.js          # ✏️  10 pre-generated puzzles
│   ├── hooks/
│   │   ├── useTimer.js         # Standalone timer hook
│   │   └── useUserProgress.js  # Progress fetch/advance hook
│   ├── utils/
│   │   ├── firebaseService.js  # All Firestore read/write ops
│   │   └── gameLogic.js        # Pure guess validation + helpers
│   ├── App.js                  # Root component + routing
│   ├── index.js                # React entry point
│   └── styles.css              # Full design system
├── .env.example                # Copy → .env.local, fill in values
├── firebase.json               # Firebase hosting config
├── firestore.rules             # Security rules
├── firestore.indexes.json
├── firebase-schema.json        # 📄 Schema reference documentation
└── package.json
```

---

## Quick Start

### 1. Install dependencies

```bash
cd connections-app
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** (production mode)
4. Enable **Authentication → Anonymous** sign-in
5. Enable **Hosting** (optional, for deployment)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your Firebase config values from the Firebase Console → Project Settings → Your Apps.

### 4. Set Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules
```

### 5. Seed puzzles to Firestore

```bash
npm install firebase-admin   # install admin SDK
# Download your service account key from Firebase Console →
# Project Settings → Service Accounts → Generate new private key
# Save it as scripts/serviceAccountKey.json

# Update YOUR_PROJECT_ID in scripts/seedPuzzles.js, then:
node scripts/seedPuzzles.js
```

### 6. Run locally

```bash
npm start
```

---

## Customization

### Changing Puzzles

Edit `src/data/puzzles.js`. Each puzzle follows this shape:

```js
{
  id: "puzzle_01",          // unique string
  title: "Puzzle 1",
  groups: [
    {
      category: "Category Name",  // displayed on solved row
      color: "yellow",            // yellow | green | blue | purple
      words: ["WORD1", "WORD2", "WORD3", "WORD4"]  // exactly 4 words
    },
    // ... 3 more groups
  ]
}
```

After editing, re-run the seeder or update Firestore manually.

### Changing Survey Questions

Edit `src/config/surveySchema.js`. Supported field types:

| type       | description                          |
|------------|--------------------------------------|
| `rating`   | 1–5 star rating with min/max labels  |
| `textarea` | Multi-line free text                 |
| `radio`    | Single-choice from a list of options |
| `select`   | Dropdown of options                  |

```js
{
  id: "my_question",           // unique ID, used as Firestore key
  label: "Question text?",
  type: "rating",              // rating | textarea | radio | select
  required: true,              // validates before submit
  labels: { low: "Easy", high: "Hard" },  // for rating type
  options: ["Option A", "Option B"],       // for radio/select
  placeholder: "Type here…",              // for textarea
}
```

### Changing Max Mistakes

In `src/context/GameContext.js`, change:

```js
export const MAX_MISTAKES = 4;  // ← change this number
```

---

## Firebase Schema

See `firebase-schema.json` for the full documented schema. Summary:

```
/puzzles/{puzzleId}                  — puzzle definitions (read-only)
/users/{userId}/meta/progress        — current puzzle index + completed list
/users/{userId}/gameplay/{puzzleId}  — attempts, timing, correct groups
/users/{userId}/surveys/{puzzleId}   — survey responses
```

---

## Game Rules

- Users are assigned an anonymous Firebase UID on first visit (persists in browser)
- Puzzles must be completed sequentially — no skipping
- Each puzzle allows up to `MAX_MISTAKES` (default: 4) wrong guesses
- After every puzzle (win or lose), the survey screen appears
- Progress is saved after each survey submission
- Refreshing mid-puzzle resumes the same session

---

## Deployment

```bash
npm run build
firebase deploy --only hosting
```

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, Context API   |
| Styling    | Pure CSS (no framework) |
| Auth       | Firebase Anonymous Auth |
| Database   | Cloud Firestore         |
| Hosting    | Firebase Hosting        |

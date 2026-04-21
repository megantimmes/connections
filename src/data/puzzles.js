// src/data/puzzles.js
// ─────────────────────────────────────────────────────────────
// 10 pre-generated puzzles. Each puzzle has:
//   - id: unique string
//   - groups: array of 4 groups, each with { category, color, words[] }
// Colors: "yellow" | "green" | "blue" | "purple" (easy → hard)
// ─────────────────────────────────────────────────────────────

const PUZZLES = [
  {
    id: "puzzle_01",
    title: "Puzzle 1",
    groups: [
      {
        category: "Things in a Toolbox",
        color: "yellow",
        words: ["HAMMER", "WRENCH", "PLIERS", "CHISEL"],
      },
      {
        category: "___ Berry",
        color: "green",
        words: ["STRAW", "GOOSE", "BLUE", "RASP"],
      },
      {
        category: "Famous Operas",
        color: "blue",
        words: ["AIDA", "TOSCA", "CARMEN", "NORMA"],
      },
      {
        category: "Poker Hands",
        color: "purple",
        words: ["FLUSH", "STRAIGHT", "FULL", "QUADS"],
      },
    ],
  },
  {
    id: "puzzle_02",
    title: "Puzzle 2",
    groups: [
      {
        category: "Breakfast Foods",
        color: "yellow",
        words: ["WAFFLE", "BAGEL", "CREPE", "MUFFIN"],
      },
      {
        category: "Shades of Blue",
        color: "green",
        words: ["COBALT", "AZURE", "TEAL", "NAVY"],
      },
      {
        category: "Greek Letters",
        color: "blue",
        words: ["ALPHA", "DELTA", "OMEGA", "SIGMA"],
      },
      {
        category: "Things that 'Run'",
        color: "purple",
        words: ["NOSE", "RIVER", "PROGRAM", "STOCKING"],
      },
    ],
  },
  {
    id: "puzzle_03",
    title: "Puzzle 3",
    groups: [
      {
        category: "Dog Breeds",
        color: "yellow",
        words: ["BEAGLE", "POODLE", "BOXER", "COLLIE"],
      },
      {
        category: "Planets",
        color: "green",
        words: ["MARS", "VENUS", "SATURN", "URANUS"],
      },
      {
        category: "Words that follow 'Black'",
        color: "blue",
        words: ["BIRD", "BERRY", "SMITH", "BOARD"],
      },
      {
        category: "Jazz Legends",
        color: "purple",
        words: ["COLTRANE", "MONK", "MINGUS", "PARKER"],
      },
    ],
  },
  {
    id: "puzzle_04",
    title: "Puzzle 4",
    groups: [
      {
        category: "Vegetables",
        color: "yellow",
        words: ["KALE", "LEEK", "TURNIP", "ENDIVE"],
      },
      {
        category: "Architecture Styles",
        color: "green",
        words: ["GOTHIC", "BAROQUE", "BRUTALIST", "TUDOR"],
      },
      {
        category: "Card Games",
        color: "blue",
        words: ["BRIDGE", "SNAP", "RUMMY", "SOLITAIRE"],
      },
      {
        category: "___ Stone",
        color: "purple",
        words: ["ROLLING", "KIDNEY", "LIME", "COBBLE"],
      },
    ],
  },
  {
    id: "puzzle_05",
    title: "Puzzle 5",
    groups: [
      {
        category: "Types of Cheese",
        color: "yellow",
        words: ["BRIE", "GOUDA", "HAVARTI", "MANCHEGO"],
      },
      {
        category: "Olympic Sports",
        color: "green",
        words: ["EPEE", "LUGE", "BIATHLON", "POMMEL"],
      },
      {
        category: "Shakespeare Plays",
        color: "blue",
        words: ["OTHELLO", "MACBETH", "TEMPEST", "PERICLES"],
      },
      {
        category: "Words containing hidden animals",
        color: "purple",
        words: ["CARAT", "PROWL", "SHEAR", "FIASCO"],
      },
    ],
  },
  {
    id: "puzzle_06",
    title: "Puzzle 6",
    groups: [
      {
        category: "Parts of a Ship",
        color: "yellow",
        words: ["BOW", "STERN", "HULL", "KEEL"],
      },
      {
        category: "Cocktail Ingredients",
        color: "green",
        words: ["BITTERS", "GRENADINE", "VERMOUTH", "CURACAO"],
      },
      {
        category: "Nobel Prize Categories",
        color: "blue",
        words: ["PHYSICS", "PEACE", "LITERATURE", "CHEMISTRY"],
      },
      {
        category: "Homophones of other words",
        color: "purple",
        words: ["KNOT", "HEIR", "WRAP", "SUITE"],
      },
    ],
  },
  {
    id: "puzzle_07",
    title: "Puzzle 7",
    groups: [
      {
        category: "Things in a Bakery",
        color: "yellow",
        words: ["LOAF", "TART", "ÉCLAIR", "BRIOCHE"],
      },
      {
        category: "Musical Tempos",
        color: "green",
        words: ["ALLEGRO", "PRESTO", "ADAGIO", "VIVACE"],
      },
      {
        category: "Things that are 'Sharp'",
        color: "blue",
        words: ["TACK", "CHEDDAR", "WIT", "TURN"],
      },
      {
        category: "Collective Nouns",
        color: "purple",
        words: ["MURDER", "PARLIAMENT", "BLOAT", "UNKINDNESS"],
      },
    ],
  },
  {
    id: "puzzle_08",
    title: "Puzzle 8",
    groups: [
      {
        category: "Dinosaurs",
        color: "yellow",
        words: ["RAPTOR", "STEGO", "BRACHIO", "DIPLODO"],
      },
      {
        category: "US State Capitals",
        color: "green",
        words: ["AUSTIN", "ALBANY", "BOISE", "TOPEKA"],
      },
      {
        category: "Words meaning 'Fake'",
        color: "blue",
        words: ["SHAM", "BOGUS", "SPURIOUS", "ERSATZ"],
      },
      {
        category: "___ drop",
        color: "purple",
        words: ["TEAR", "NAME", "BACK", "RAIN"],
      },
    ],
  },
  {
    id: "puzzle_09",
    title: "Puzzle 9",
    groups: [
      {
        category: "Things at a Carnival",
        color: "yellow",
        words: ["FUNNEL", "FERRIS", "TILT", "BUMPER"],
      },
      {
        category: "Famous Bridges",
        color: "green",
        words: ["GOLDEN", "TOWER", "BROOKLYN", "SYDNEY"],
      },
      {
        category: "Chess Pieces",
        color: "blue",
        words: ["ROOK", "BISHOP", "KNIGHT", "PAWN"],
      },
      {
        category: "Words that become new words spelled backwards",
        color: "purple",
        words: ["STRESSED", "REPAID", "REWARD", "STRAW"],
      },
    ],
  },
  {
    id: "puzzle_10",
    title: "Puzzle 10",
    groups: [
      {
        category: "Flowers",
        color: "yellow",
        words: ["DAHLIA", "ZINNIA", "PEONY", "FOXGLOVE"],
      },
      {
        category: "Coding Languages",
        color: "green",
        words: ["RUST", "KOTLIN", "ELIXIR", "SWIFT"],
      },
      {
        category: "Philosophical Concepts",
        color: "blue",
        words: ["LOGOS", "PATHOS", "ETHOS", "KAIROS"],
      },
      {
        category: "Things with 'Keys'",
        color: "purple",
        words: ["PIANO", "FLORIDA", "MONKEY", "LOCK"],
      },
    ],
  },
];

export default PUZZLES;

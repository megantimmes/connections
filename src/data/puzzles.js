const PUZZLES = [
  {
    id: "puzzle_01_nyt",
    title: "Puzzle 1",
    order: 1,
    groups: [
      {
        category: "YEARN",
        color: "yellow",
        words: ["DESIRE", "LONG", "PINE", "YEN"],
      },
      {
        category: "MAGAZINES",
        color: "green",
        words: ["FORTUNE", "MAD", "NATURE", "O"],
      },
      {
        category: "CHARACTERS IN BOND MOVIES",
        color: "blue",
        words: ["BOND", "M", "MONEYPENNY", "Q"],
      },
      {
        category: "WORDS THAT PRECEDE 'POP' IN MUSIC GENRES",
        color: "purple",
        words: ["BUBBLEGUM", "EURO", "K", "POWER"],
      },
    ],
  },
  {
    id: "puzzle_02_multi",
    title: "Puzzle 2",
    order: 2,
    groups: [
      {
        category: "BARBER TOOLS",
        color: "yellow",
        words: ["CLIPPERS", "COMB", "RAZOR", "SHEARS"],
      },
      {
        category: "HOMOPHONES OF LETTERS",
        color: "green",
        words: ["BEE", "EYE", "JAY", "SEA"],
      },
      {
        category: "___ FENCE",
        color: "blue",
        words: ["IRON", "PICKET", "PRIVACY", "RAIL"],
      },
      {
        category: "ONE-SYLLABLE WORDS ENDING IN DOUBLE L",
        color: "purple",
        words: ["BALL", "GULL", "KILL", "TOLL"],
      },
    ],
  },
  {
    id: "puzzle_03_gpt",
    title: "Puzzle 3",
    order: 3,
    groups: [
      {
        category: "Breakfast Foods",
        color: "yellow",
        words: ["BACON", "EGGS", "PANCAKES", "WAFFLES"],
      },
      {
        category: "Parts of a Tree",
        color: "green",
        words: ["BARK", "BRANCH", "LEAF", "ROOT"],
      },
      {
        category: "Card Game Actions",
        color: "blue",
        words: ["BID", "DEAL", "DRAW", "FOLD"],
      },
      {
        category: "Preceded by FIRE",
        color: "purple",
        words: ["ANT", "DRILL", "FLY", "WALL"],
      },
    ],
  },
  {
    id: "puzzle_04_nyt",
    title: "Puzzle 4",
    order: 4,
    groups: [
      {
        category: "BIOLOGICAL BUILDING BLOCKS",
        color: "yellow",
        words: ["ATOM", "CELL", "MOLECULE", "PROTEIN"],
      },
      {
        category: "PURCHASES FOR A BABY",
        color: "green",
        words: ["BOTTLE", "CRIB", "MOBILE", "RATTLE"],
      },
      {
        category: "OBJECTS PLAYED AS INSTRUMENTS",
        color: "blue",
        words: ["JUG", "SAW", "SPOONS", "WASHBOARD"],
      },
      {
        category: "___ TAG",
        color: "purple",
        words: ["DOG", "FREEZE", "PHONE", "PRICE"],
      },
    ],
  },
  {
    id: "puzzle_05_multi",
    title: "Puzzle 5",
    order: 5,
    groups: [
      {
        category: "HOLLYWOOD ACTORS NAMED CHRIS",
        color: "yellow",
        words: ["EVANS", "HEMSWORTH", "PINE", "PRATT"],
      },
      {
        category: "SYNONYMS OF TRUMPET, AS A VERB",
        color: "green",
        words: ["ADVERTISE", "AVOW", "DECLARE", "PROMULGATE"],
      },
      {
        category: "BLACKJACK PLAYER DECISIONS",
        color: "blue",
        words: ["DOUBLE", "HIT", "SPLIT", "STAND"],
      },
      {
        category: "SAXOPHONE BRANDS",
        color: "purple",
        words: ["CANNONBALL", "KING", "SELMER", "YAMAHA"],
      },
    ],
  },
  {
    id: "puzzle_06_gpt",
    title: "Puzzle 6",
    order: 6,
    groups: [
      {
        category: "Card Suits",
        color: "yellow",
        words: ["CLUB", "DIAMOND", "HEART", "SPADE"],
      },
      {
        category: "Farm Animals",
        color: "green",
        words: ["COW", "GOAT", "PIG", "SHEEP"],
      },
      {
        category: "Words with Silent First Letters",
        color: "blue",
        words: ["GNOME", "KNEE", "PSALM", "WRIST"],
      },
      {
        category: "___ Jack",
        color: "purple",
        words: ["APPLE", "CAR", "CRACKER", "LUMBER"],
      },
    ],
  },
  {
    id: "puzzle_07_nyt",
    title: "Puzzle 7",
    order: 7,
    groups: [
      {
        category: "CHANGE STATES OF MATTER",
        color: "yellow",
        words: ["CONDENSE", "FREEZE", "MELT", "VAPORIZE"],
      },
      {
        category: "REPLACEMENT",
        color: "green",
        words: ["ALTERNATE", "BACKUP", "COVER", "SUB"],
      },
      {
        category: "SLANGY NAMES FOR PROFESSIONS",
        color: "blue",
        words: ["COPPER", "HACK", "SHRINK", "SUIT"],
      },
      {
        category: "MARIAH CAREY NUMBER ONE HITS",
        color: "purple",
        words: ["FANTASY", "HERO", "HONEY", "SOMEDAY"],
      },
    ],
  },
  {
    id: "puzzle_08_multi",
    title: "Puzzle 8",
    order: 8,
    groups: [
      {
        category: "FANTASY RPG CLASSES",
        color: "yellow",
        words: ["BARD", "CLERIC", "DRUID", "RANGER"],
      },
      {
        category: "VIDEO-CALL APP CONTROLS",
        color: "green",
        words: ["CHAT", "MUTE", "RECORD", "SHARE"],
      },
      {
        category: "WORDS WITH SILENT FIRST LETTERS",
        color: "blue",
        words: ["KNEAD", "MNEMONIC", "PSALM", "WRIST"],
      },
      {
        category: "PENCIL BRANDS",
        color: "purple",
        words: ["DIXON", "KUM", "PENTEL", "STAEDTLER"],
      },
    ],
  },
];

export default PUZZLES;
if (typeof module !== "undefined") module.exports = PUZZLES;
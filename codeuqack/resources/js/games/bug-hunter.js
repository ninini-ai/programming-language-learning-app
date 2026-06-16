import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { completeLesson } from "../gamification";

const course = window.COURSE;

// ─── SCREENS ───────────────────────────────────────────────
const lockedScreen    = document.getElementById("lockedScreen");
const gameScreen      = document.getElementById("gameScreen");
const completedScreen = document.getElementById("completedScreen");

// ─── GAME UI ───────────────────────────────────────────────
const codeBlock    = document.getElementById("codeBlock");
const optionsArea  = document.getElementById("optionsArea");
const feedback     = document.getElementById("feedback");
const hintBox      = document.getElementById("hintBox");
const hintText     = document.getElementById("hintText");
const hintBtn      = document.getElementById("hintBtn");
const nextBtn      = document.getElementById("nextBtn");
const xpDisplay    = document.getElementById("xpDisplay");
const currentLevel = document.getElementById("currentLevel");
const qNum         = document.getElementById("qNum");
const qTotal       = document.getElementById("qTotal");
const finalXP      = document.getElementById("finalXP");

// ─── GAME STATE ────────────────────────────────────────────
let questions    = [];
let currentIndex = 0;
let sessionXP    = 0;
let answered     = false;
let userData     = null;
let gameId       = `bug-hunter-${course}`;

// ─── ALL QUESTIONS ─────────────────────────────────────────
// Level = min lessons completed needed to unlock that question

const ALL_QUESTIONS = {

  cpp: [
    // Level 1 – after lesson 1
    {
      level: 1,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World"\n    return 0;\n}`,
      options: [
        "Missing semicolon after cout statement",
        "Wrong include header",
        "main() has wrong return type",
        "cout is misspelled"
      ],
      correct: 0,
      hint: "Every statement in C++ must end with a specific symbol.",
      explanation: "A semicolon `;` is missing after the cout statement."
    },
    {
      level: 1,
      code: `#include <iostream>\nusing namespace std\nint main() {\n    cout << "Hi";\n    return 0;\n}`,
      options: [
        "Missing semicolon after using namespace std",
        "cout is wrong",
        "return type is wrong",
        "include is missing"
      ],
      correct: 0,
      hint: "Check the line that says 'using namespace std'.",
      explanation: "`using namespace std` must end with a semicolon."
    },

    // Level 2 – after lesson 2
    {
      level: 2,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5\n    int y = 10;\n    cout << x + y;\n    return 0;\n}`,
      options: [
        "Missing semicolon after int x = 5",
        "Wrong variable names",
        "cout should use printf",
        "Missing return statement"
      ],
      correct: 0,
      hint: "Look at the variable declarations carefully.",
      explanation: "`int x = 5` is missing a semicolon at the end."
    },
    {
      level: 2,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5;\n    if (x > 3)\n        cout << "Big";\n    else\n        cout << "Small"\n    return 0;\n}`,
      options: [
        "Missing semicolon after cout << \"Small\"",
        "if condition is wrong",
        "Missing braces around if",
        "else is not allowed"
      ],
      correct: 0,
      hint: "Check every cout statement for the ending symbol.",
      explanation: "The cout in the else branch is missing a semicolon."
    },

    // Level 3 – after lesson 3
    {
      level: 3,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 0; i < 5; i++)\n        cout << i\n    return 0;\n}`,
      options: [
        "Missing semicolon after cout << i",
        "for loop syntax is wrong",
        "i++ should be ++i",
        "Missing include"
      ],
      correct: 0,
      hint: "The output statement inside the loop needs something at the end.",
      explanation: "`cout << i` is missing a semicolon."
    },
    {
      level: 3,
      code: `#include <iostream>\nusing namespace std;\nint add(int a, int b) {\n    return a + b\n}\nint main() {\n    cout << add(2, 3);\n    return 0;\n}`,
      options: [
        "Missing semicolon after return a + b",
        "Function name is wrong",
        "Parameters are wrong",
        "cout is wrong"
      ],
      correct: 0,
      hint: "Check the return statement inside the add function.",
      explanation: "`return a + b` needs a semicolon at the end."
    },

    // Level 4 – after lesson 4
    {
      level: 4,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int arr[3] = {1, 2, 3};\n    for (int i = 0; i <= 3; i++) {\n        cout << arr[i];\n    }\n    return 0;\n}`,
      options: [
        "Array index goes out of bounds (i <= 3 should be i < 3)",
        "Array size is wrong",
        "for loop is missing braces",
        "cout is wrong"
      ],
      correct: 0,
      hint: "An array of size 3 has valid indexes 0, 1, 2.",
      explanation: "The condition `i <= 3` causes out-of-bounds access. It should be `i < 3`."
    },

    // Level 5 – after lesson 5
    {
      level: 5,
      code: `#include <iostream>\nusing namespace std;\nvoid greet(string name) {\n    cout << "Hello " + name;\n}\nint main() {\n    greet()\n    return 0;\n}`,
      options: [
        "greet() called without argument and missing semicolon",
        "Function return type is wrong",
        "cout uses wrong operator",
        "string type is not allowed"
      ],
      correct: 0,
      hint: "greet needs a name passed to it, and every statement needs an ending.",
      explanation: "`greet()` is missing the required argument and a semicolon."
    },
  ],

  python: [
    // Level 1 – after lesson 1
    {
      level: 1,
      code: `print("Hello World"`,
      options: [
        "Missing closing parenthesis",
        "print is misspelled",
        "String has wrong quotes",
        "Missing import"
      ],
      correct: 0,
      hint: "Count the opening and closing brackets.",
      explanation: "`print(` is opened but never closed. Add `)` at the end."
    },
    {
      level: 1,
      code: `name = "Alice"\nprint("Hello" + name)`,
      options: [
        "Missing space — should be \"Hello \" + name",
        "name variable is wrong",
        "print is wrong",
        "Quotes mismatch"
      ],
      correct: 0,
      hint: "What will the output look like without a space?",
      explanation: "\"Hello\" + name gives \"HelloAlice\". Add a space: \"Hello \" + name."
    },

    // Level 2 – after lesson 2
    {
      level: 2,
      code: `x = 10\ny = 3\nprint(x / y\n`,
      options: [
        "Missing closing parenthesis in print",
        "Division operator is wrong",
        "Variable names are wrong",
        "Missing import"
      ],
      correct: 0,
      hint: "Check if all brackets are balanced.",
      explanation: "`print(x / y` is missing the closing `)`."
    },
    {
      level: 2,
      code: `age = 18\nif age >= 18\n    print("Adult")`,
      options: [
        "Missing colon after if condition",
        "Condition is wrong",
        "print is wrong",
        "age variable is wrong"
      ],
      correct: 0,
      hint: "Python if statements need a special symbol at the end.",
      explanation: "A colon `:` is required after every `if` condition."
    },

    // Level 3 – after lesson 3
    {
      level: 3,
      code: `for i in range(5)\n    print(i)`,
      options: [
        "Missing colon after for loop",
        "range is wrong",
        "print is wrong",
        "i is not defined"
      ],
      correct: 0,
      hint: "Like if statements, for loops also need a special ending symbol.",
      explanation: "A colon `:` is missing after `for i in range(5)`."
    },
    {
      level: 3,
      code: `numbers = [1, 2, 3, 4, 5]\ntotal = 0\nfor n in numbers:\n    total = total + n\nprint(total`,
      options: [
        "Missing closing parenthesis in print",
        "total calculation is wrong",
        "list syntax is wrong",
        "for loop is wrong"
      ],
      correct: 0,
      hint: "Check the last line carefully.",
      explanation: "`print(total` is missing the closing `)`."
    },

    // Level 4 – after lesson 4
    {
      level: 4,
      code: `def greet(name):\n    print("Hello " + name)\n\ngreet("Alice)\n`,
      options: [
        "String not closed — missing quote before closing parenthesis",
        "Function name is wrong",
        "print is wrong",
        "def keyword is wrong"
      ],
      correct: 0,
      hint: "Look at the string inside greet() call.",
      explanation: "`\"Alice` is missing the closing `\"`. Should be `\"Alice\"`."
    },

    // Level 5 – after lesson 5
    {
      level: 5,
      code: `def add(a, b):\n    return a + b\n\nresult = add(5)\nprint(result)`,
      options: [
        "add() called with only 1 argument but needs 2",
        "return statement is wrong",
        "print is wrong",
        "result variable is wrong"
      ],
      correct: 0,
      hint: "How many parameters does add() expect?",
      explanation: "`add(a, b)` requires 2 arguments but was called with only 1."
    },
  ]

};

// ─── HELPERS ───────────────────────────────────────────────
function show(el)  { el.classList.remove("hidden"); }
function hide(el)  { el.classList.add("hidden"); }

function getLessonsCompleted() {
  return (userData?.progress?.[course]?.lessonsCompleted || []).length;
}

function getAvailableQuestions() {
  const lessonsCount = getLessonsCompleted();
  return ALL_QUESTIONS[course].filter(q => q.level <= Math.max(1, lessonsCount));
}

// ─── RENDER QUESTION ───────────────────────────────────────
function renderQuestion() {
  const q = questions[currentIndex];

  answered = false;
  hide(feedback);
  hide(hintBox);
  hide(nextBtn);

  codeBlock.textContent = q.code;

  qNum.textContent   = currentIndex + 1;
  qTotal.textContent = questions.length;
  currentLevel.textContent = q.level;

  optionsArea.innerHTML = q.options.map((opt, i) => `
    <button
      data-index="${i}"
      class="option-btn w-full text-left px-4 py-3 bg-white border-2 border-gray-200
             rounded-xl font-semibold text-deepChocolate hover:border-warmOrange
             hover:bg-orange-50 transition">
      ${opt}
    </button>
  `).join("");

  optionsArea.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => handleAnswer(parseInt(btn.dataset.index)));
  });
}

// ─── HANDLE ANSWER ─────────────────────────────────────────
function handleAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const buttons = optionsArea.querySelectorAll(".option-btn");

  buttons.forEach(btn => btn.disabled = true);

  if (chosen === q.correct) {
    buttons[chosen].classList.add("border-green-400", "bg-green-50", "text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct! ${q.explanation}`;
    sessionXP += 10;
    xpDisplay.textContent = sessionXP;
  } else {
    buttons[chosen].classList.add("border-red-400", "bg-red-50", "text-red-700");
    buttons[q.correct].classList.add("border-green-400", "bg-green-50", "text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Not quite. ${q.explanation}`;
  }

  show(feedback);
  show(nextBtn);
}

// ─── NEXT QUESTION ─────────────────────────────────────────
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    endGame();
  }
});

// ─── HINT ──────────────────────────────────────────────────
hintBtn.addEventListener("click", () => {
  const q = questions[currentIndex];
  hintText.textContent = q.hint;
  hintBox.classList.toggle("hidden");
});

// ─── END GAME ──────────────────────────────────────────────
async function endGame() {
  hide(gameScreen);
  show(completedScreen);
  finalXP.textContent = sessionXP;

  // Save XP to Firestore using gamification
  if (sessionXP > 0 && auth.currentUser) {
    try {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      const data = snap.data();

      const currentXP = data.xp?.[course] || 0;
      const newXP     = currentXP + sessionXP;
      const newLevel  = Math.floor(newXP / 100) + 1;

      await updateDoc(ref, {
        [`xp.${course}`]:    increment(sessionXP),
        [`level.${course}`]: newLevel,
      });
    } catch (err) {
      console.error("XP save error:", err);
    }
  }
}

// ─── RESTART ───────────────────────────────────────────────
window.restartGame = () => {
  currentIndex = 0;
  sessionXP    = 0;
  xpDisplay.textContent = 0;
  hide(completedScreen);
  show(gameScreen);
  questions = getAvailableQuestions();
  renderQuestion();
};

// ─── INIT ──────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap = await getDoc(doc(db, "users", user.uid));
  userData   = snap.data() || {};

  const lessonsCount = getLessonsCompleted();
  xpDisplay.textContent = userData.xp?.[course] || 0;

  // LOCK CHECK — must have completed at least lesson 1
  if (lessonsCount < 1) {
    show(lockedScreen);
    return;
  }

  // Load questions available at current progress
  questions = getAvailableQuestions();

  show(gameScreen);
  renderQuestion();
});
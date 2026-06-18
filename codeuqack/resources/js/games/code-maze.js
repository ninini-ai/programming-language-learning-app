import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const course = window.COURSE;

// ── Screens ────────────────────────────────────────────────
const lockedScreen = document.getElementById("lockedScreen");
const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
const loseScreen   = document.getElementById("loseScreen");

// ── UI ─────────────────────────────────────────────────────
const mazeGrid     = document.getElementById("mazeGrid");
const livesDisplay = document.getElementById("livesDisplay");
const qNum         = document.getElementById("qNum");
const qNumCard     = document.getElementById("qNumCard");
const qTotal       = document.getElementById("qTotal");
const questionText = document.getElementById("questionText");
const optionsArea  = document.getElementById("optionsArea");
const feedback     = document.getElementById("feedback");
const nextBtn      = document.getElementById("nextBtn");
const xpDisplay    = document.getElementById("xpDisplay");
const finalXP      = document.getElementById("finalXP");
const progressBar  = document.getElementById("progressBar");
const stepCount    = document.getElementById("stepCount");
const stepTotal    = document.getElementById("stepTotal");

// ── State ──────────────────────────────────────────────────
let lives      = 3;
let sessionXP  = 0;
let qIndex     = 0;
let answered   = false;
let questions  = [];
let playerPos  = { r: 0, c: 0 };
let userData   = null;

// ── Directions each correct answer moves the player ────────

const DIRECTIONS = ["right","right","down","down","right","down","right","down","down","right"];

// ── Maze layout ────────────────────────────────────────────
// 7×7 grid. 0 = path, 1 = wall
// Player starts top-left (0,0), goal is bottom-right area
const MAZE = [
  [0, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
const ROWS = MAZE.length;
const COLS = MAZE[0].length;
const GOAL = { r: 6, c: 6 };
const START = { r: 0, c: 0 };

// Pre-defined solution path (sequence of {r,c} cells player visits)
const SOLUTION_PATH = [
  {r:0,c:0},{r:0,c:1},
  {r:1,c:1},{r:2,c:1},{r:2,c:2},{r:2,c:3},
  {r:3,c:3},{r:3,c:4},{r:3,c:5},{r:3,c:6},
  {r:4,c:6},
  {r:5,c:6},
  {r:6,c:6}
];

// ── All Questions ──────────────────────────────────────────
const ALL_QUESTIONS = {

  cpp: [
    { level:1, question:"What is C++?",
      options:["Programming Language","Database","Browser","OS"],
      correct:0, explanation:"C++ is a programming language." },

    { level:1, question:"Which symbol ends a C++ statement?",
      options:[".",";"," ,",":"],
      correct:1, explanation:"A semicolon `;` ends every C++ statement." },

    { level:2, question:"Which header is needed for cout?",
      options:["<stdio.h>","<string>","<iostream>","<math.h>"],
      correct:2, explanation:"`#include <iostream>` enables cout." },

    { level:2, question:"What does `int` mean?",
      options:["Decimal number","Whole number","Text","True/False"],
      correct:1, explanation:"`int` stores whole numbers." },

    { level:3, question:"Which loop runs at least once?",
      options:["for","while","do-while","if"],
      correct:2, explanation:"A do-while loop always runs its body at least once." },

    { level:3, question:"How do you start a single-line comment in C++?",
      options:["/*","#","//","--"],
      correct:2, explanation:"`//` starts a single-line comment." },

    { level:4, question:"What is the index of the first element of an array?",
      options:["1","0","-1","Depends"],
      correct:1, explanation:"Arrays in C++ are zero-indexed." },

    { level:4, question:"Which keyword defines a function that returns nothing?",
      options:["int","string","void","null"],
      correct:2, explanation:"`void` means the function returns no value." },

    { level:5, question:"What does `cin` do?",
      options:["Prints output","Takes user input","Defines a class","Loops"],
      correct:1, explanation:"`cin` reads input from the user." },

    { level:5, question:"Which operator checks equality in C++?",
      options:["=","=>","==","!="],
      correct:2, explanation:"`==` compares two values for equality." },
  ],

  python: [
    { level:1, question:"Python is a:",
      options:["Programming Language","Database","Framework","Compiler"],
      correct:0, explanation:"Python is a programming language." },

    { level:1, question:"How do you print in Python?",
      options:["echo()","console.log()","print()","System.out.println()"],
      correct:2, explanation:"`print()` outputs text in Python." },

    { level:2, question:"Which symbol starts a Python comment?",
      options:["//","/*","#","--"],
      correct:2, explanation:"`#` starts a comment in Python." },

    { level:2, question:"How do you create a variable in Python?",
      options:["int x = 5","var x = 5","x = 5","let x = 5"],
      correct:2, explanation:"Python uses `x = 5` — no keyword needed." },

    { level:3, question:"What keyword starts a Python loop?",
      options:["loop","repeat","for","iterate"],
      correct:2, explanation:"`for` starts a loop in Python." },

    { level:3, question:"What does `len()` return?",
      options:["Last element","Sum","Length of object","Random number"],
      correct:2, explanation:"`len()` returns the number of items." },

    { level:4, question:"How do you define a function in Python?",
      options:["function greet():","def greet():","fun greet():","greet() =>"],
      correct:1, explanation:"`def` is used to define a function." },

    { level:4, question:"Which of these is a Python list?",
      options:["{1,2,3}","(1,2,3)","[1,2,3]","<1,2,3>"],
      correct:2, explanation:"Square brackets `[]` define a list." },

    { level:5, question:"What does `range(5)` produce?",
      options:["1 to 5","0 to 5","0 to 4","1 to 4"],
      correct:2, explanation:"`range(5)` gives 0,1,2,3,4." },

    { level:5, question:"Which keyword exits a loop early?",
      options:["stop","exit","end","break"],
      correct:3, explanation:"`break` exits a loop immediately." },
  ],

};

// ── Helpers ────────────────────────────────────────────────
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function getLessonsCompleted() {
  return (userData?.progress?.[course]?.lessonsCompleted || []).length;
}

function getQuestions() {
  const n = Math.max(1, getLessonsCompleted());
  return ALL_QUESTIONS[course].filter(q => q.level <= n);
}

// ── Render Lives ───────────────────────────────────────────
function renderLives() {
  livesDisplay.innerHTML = [0,1,2].map(i =>
    `<i class="fa-solid fa-heart heart ${i >= lives ? "lost" : ""}"></i>`
  ).join(" ");
}

// ── Render Maze ───────────────────────────────────────────
function renderMaze() {
  mazeGrid.style.gridTemplateColumns = `repeat(${COLS}, 44px)`;
  mazeGrid.innerHTML = "";

  const visitedSet = new Set(
    SOLUTION_PATH.slice(0, qIndex + 1).map(p => `${p.r},${p.c}`)
  );

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      if (MAZE[r][c] === 1) {
        cell.classList.add("wall");
      } else if (r === playerPos.r && c === playerPos.c) {
        cell.classList.add("player");
        cell.textContent = "🐤";
      } else if (r === GOAL.r && c === GOAL.c) {
        cell.classList.add("goal");
        cell.textContent = "🏁";
      } else if (visitedSet.has(`${r},${c}`)) {
        cell.classList.add("visited");
      } else {
        cell.classList.add("path");
      }

      mazeGrid.appendChild(cell);
    }
  }
}

// ── Render Question ────────────────────────────────────────
function renderQuestion() {
  answered = false;
  hide(feedback);
  hide(nextBtn);

  const q = questions[qIndex];
  const total = questions.length;

  questionText.textContent = q.question;
  qNum.textContent     = qIndex + 1;
  qNumCard.textContent = qIndex + 1;
  qTotal.textContent   = total;
  progressBar.style.width = `${(qIndex / total) * 100}%`;
  stepCount.textContent   = qIndex;
  stepTotal.textContent   = Math.min(total, SOLUTION_PATH.length - 1);

  optionsArea.innerHTML = q.options.map((opt, i) => {
    // Direction label like in the screenshot
    const dir = ["Up","Down","Left","Right"][i % 4];
    return `
      <button data-index="${i}"
        class="option-btn w-full flex items-center gap-3 px-4 py-3
               bg-white border-2 border-gray-200 rounded-xl
               hover:border-warmOrange hover:bg-orange-50 transition">
        <span class="bg-warmOrange text-white text-xs font-bold px-2 py-1 rounded-md min-w-[48px] text-center">
          ${dir}
        </span>
        <span class="font-semibold text-deepChocolate">${opt}</span>
      </button>
    `;
  }).join("");

  optionsArea.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => handleAnswer(parseInt(btn.dataset.index)));
  });
}

// ── Handle Answer ──────────────────────────────────────────
function handleAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q = questions[qIndex];
  const btns = optionsArea.querySelectorAll(".option-btn");
  btns.forEach(b => b.disabled = true);

  if (chosen === q.correct) {
    btns[chosen].classList.add("border-green-400","bg-green-50");
    feedback.className = "mt-4 p-3 rounded-xl text-center font-semibold text-sm bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct! ${q.explanation}`;

    // Move player
    const nextStep = SOLUTION_PATH[Math.min(qIndex + 1, SOLUTION_PATH.length - 1)];
    playerPos = { ...nextStep };
    sessionXP += 10;
    xpDisplay.textContent = sessionXP;

  } else {
    btns[chosen].classList.add("border-red-400","bg-red-50");
    btns[q.correct].classList.add("border-green-400","bg-green-50");
    feedback.className = "mt-4 p-3 rounded-xl text-center font-semibold text-sm bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Wrong! ${q.explanation}`;
    lives--;
    renderLives();
  }

  show(feedback);
  renderMaze();

  if (lives <= 0) {
    setTimeout(() => {
      hide(gameScreen);
      show(loseScreen);
    }, 1200);
    return;
  }

  show(nextBtn);
}

// ── Next Question ──────────────────────────────────────────
nextBtn.addEventListener("click", () => {
  qIndex++;
  if (qIndex >= questions.length) {
    endGame();
  } else {
    renderQuestion();
    renderMaze();
  }
});

// ── End Game (Win) ─────────────────────────────────────────
async function endGame() {
  hide(gameScreen);
  show(winScreen);
  finalXP.textContent = sessionXP;

  if (sessionXP > 0 && auth.currentUser) {
    try {
      const ref  = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      const newXP    = (data.xp?.[course] || 0) + sessionXP;
      const newLevel = Math.floor(newXP / 100) + 1;
      await updateDoc(ref, {
        [`xp.${course}`]:    increment(sessionXP),
        [`level.${course}`]: newLevel,
      });
    } catch (e) {
      console.error("XP save error:", e);
    }
  }
}

// ── Restart ────────────────────────────────────────────────
window.restartGame = () => {
  lives      = 3;
  sessionXP  = 0;
  qIndex     = 0;
  answered   = false;
  playerPos  = { ...START };
  xpDisplay.textContent = 0;

  hide(winScreen);
  hide(loseScreen);
  show(gameScreen);

  questions = getQuestions();
  renderLives();
  renderMaze();
  renderQuestion();
};

// ── Init ───────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap = await getDoc(doc(db, "users", user.uid));
  userData   = snap.data() || {};

  if (getLessonsCompleted() < 1) {
    show(lockedScreen);
    return;
  }

  questions = getQuestions();
  playerPos = { ...START };

  show(gameScreen);
  renderLives();
  renderMaze();
  renderQuestion();
});
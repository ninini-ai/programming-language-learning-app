// code-maze.js
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { initLevelSelect } from "./game-levels";

const course = window.COURSE;
const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
const loseScreen   = document.getElementById("loseScreen");
const mazeGrid     = document.getElementById("mazeGrid");
const livesDisplay = document.getElementById("livesDisplay");
const qNum         = document.getElementById("qNum");
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
const levelTitle   = document.getElementById("levelTitle");
const backToLevels = document.getElementById("backToLevels");

let lives     = 3;
let sessionXP = 0;
let qIndex    = 0;
let answered  = false;
let questions = [];
let currentLevel = 1;

//  Dynamic maze state 
let MAZE = [];
let ROWS = 0;
let COLS = 0;
let SOLUTION_PATH = [];
let GOAL  = { r: 0, c: 0 };
let START = { r: 0, c: 0 };
let playerPos = { r: 0, c: 0 };
//make maze diff each time 
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMaze(numQuestions) {
  //how many path cells are needed.
  const totalCells = numQuestions + 1;

  const side = Math.max(2, Math.ceil(Math.sqrt(totalCells)) + 1);
  const rows = side;
  const cols = side;

  const DIRS = [
    { dr: -1, dc: 0 },
    { dr: 1,  dc: 0 },
    { dr: 0,  dc: -1 },
    { dr: 0,  dc: 1  },
  ];

  function carve() {
    const visited = new Set(["0,0"]);
    const path = [{ r: 0, c: 0 }];

    function step() {
      if (path.length === totalCells) return true;
      const current = path[path.length - 1];
      for (const dir of shuffle(DIRS)) {
        const nr = current.r + dir.dr;
        const nc = current.c + dir.dc;
        const key = `${nr},${nc}`;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited.has(key)) continue;
        visited.add(key);
        path.push({ r: nr, c: nc });
        if (step()) return true;
        path.pop();
        visited.delete(key);
      }
      return false;
    }

    return step() ? path : null;
  }

  let path = null;
  for (let attempt = 0; attempt < 15 && !path; attempt++) {
    path = carve();
  }
  // Should basically never happen at this grid size, but guard anyway.
  if (!path) {
    path = Array.from({ length: totalCells }, (_, i) => ({ r: 0, c: i }));
  }

  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  path.forEach(p => { maze[p.r][p.c] = 0; });

  return {
    maze,
    rows,
    cols,
    path,
    start: path[0],
    goal: path[path.length - 1],
  };
}

const ALL_QUESTIONS = {
  cpp: [
    { lesson:1, question:"What is C++?", options:["Programming Language","Database","Browser","OS"], correct:0, explanation:"C++ is a programming language." },
    { lesson:1, question:"Which symbol ends a C++ statement?", options:[".",";"," ,",":"], correct:1, explanation:"A semicolon `;` ends every statement." },
    { lesson:1, question:"Which symbol is used to output text in C++?", options:["<<",">>","::","->"], correct:0, explanation:"`<<` is used with `cout` to output text." },

    { lesson:2, question:"Which header is needed for cout?", options:["<stdio.h>","<string>","<iostream>","<math.h>"], correct:2, explanation:"`#include <iostream>` enables cout." },
    { lesson:2, question:"What does `int` mean?", options:["Decimal number","Whole number","Text","True/False"], correct:1, explanation:"`int` stores whole numbers." },
    { lesson:2, question:"Which of these declares a floating point number?", options:["int x;","float x;","string x;","bool x;"], correct:1, explanation:"`float` is used to declare a floating point number." },

    { lesson:3, question:"Which loop runs at least once?", options:["for","while","do-while","if"], correct:2, explanation:"A do-while loop always runs at least once." },
    { lesson:3, question:"What does `i++` do inside a for loop?", options:["Decreases i by 1","Increases i by 1","Resets i to 0","Stops the loop"], correct:1, explanation:"`i++` increases i by 1 each pass." },
    { lesson:3, question:"Which loop checks its condition first?", options:["do-while","while","Both check first","Neither"], correct:1, explanation:"A `while` loop checks its condition before running." },

    { lesson:4, question:"What is the index of the first array element?", options:["1","0","-1","Depends"], correct:1, explanation:"Arrays in C++ are zero-indexed." },
    { lesson:4, question:"What keyword is used to define a function with no return value?", options:["int","void","null","empty"], correct:1, explanation:"`void` means the function returns nothing." },
    { lesson:4, question:"What are the values passed into a function called?", options:["Arguments","Statements","Loops","Variables only"], correct:0, explanation:"Values passed into a function are called arguments (or parameters)." },

    { lesson:5, question:"What does `cin` do?", options:["Prints output","Takes user input","Defines a class","Loops"], correct:1, explanation:"`cin` reads input from the user." },
    { lesson:5, question:"How do you access the second element of an array named arr?", options:["arr(1)","arr[1]","arr{1}","arr.1"], correct:1, explanation:"Array elements are accessed using square brackets, e.g. `arr[1]`." },
    { lesson:5, question:"What happens if you access an index outside an array's bounds?", options:["It wraps around safely","Undefined behavior / possible crash","It returns 0 automatically","It resizes the array"], correct:1, explanation:"Accessing out-of-bounds indexes in C++ leads to undefined behavior." },
  ],
  python: [
    { lesson:1, question:"Python is a:", options:["Programming Language","Database","Framework","Compiler"], correct:0, explanation:"Python is a programming language." },
    { lesson:1, question:"How do you print in Python?", options:["echo()","console.log()","print()","System.out.println()"], correct:2, explanation:"`print()` outputs text." },
    { lesson:1, question:"Which of these is a valid Python string?", options:['"Hello"',"Hello","(Hello)","[Hello]"], correct:0, explanation:"Strings in Python are wrapped in quotes." },

    { lesson:2, question:"Which symbol starts a Python comment?", options:["//","/*","#","--"], correct:2, explanation:"`#` starts a comment." },
    { lesson:2, question:"How do you create a variable?", options:["int x = 5","var x = 5","x = 5","let x = 5"], correct:2, explanation:"Python uses `x = 5`." },
    { lesson:2, question:"Which operator is used for exponents in Python?", options:["^","**","%%","exp()"], correct:1, explanation:"`**` is the exponent operator in Python." },

    { lesson:3, question:"What keyword starts a Python loop?", options:["loop","repeat","for","iterate"], correct:2, explanation:"`for` starts a loop." },
    { lesson:3, question:"What does `range(3)` produce?", options:["1,2,3","0,1,2","0,1,2,3","1,2"], correct:1, explanation:"`range(3)` produces 0, 1, 2." },
    { lesson:3, question:"Which keyword stops a loop early?", options:["stop","break","end","exit"], correct:1, explanation:"`break` exits a loop early." },

    { lesson:4, question:"How do you define a function?", options:["function greet():","def greet():","fun greet():","greet() =>"], correct:1, explanation:"`def` defines a function." },
    { lesson:4, question:"What keyword returns a value from a function?", options:["give","return","output","yield only"], correct:1, explanation:"`return` sends a value back from a function." },
    { lesson:4, question:"What is `name` in `def greet(name):`?", options:["A keyword","A parameter","A return value","A loop variable"], correct:1, explanation:"`name` is a parameter of the function." },

    { lesson:5, question:"What does `range(5)` produce?", options:["1 to 5","0 to 5","0 to 4","1 to 4"], correct:2, explanation:"`range(5)` gives 0,1,2,3,4." },
    { lesson:5, question:"How do you access the first item in a Python list called `nums`?", options:["nums(0)","nums[0]","nums{0}","nums.first()"], correct:1, explanation:"List items are accessed using square brackets, e.g. `nums[0]`." },
    { lesson:5, question:"What does `len(nums)` return for a list of 3 items?", options:["2","3","4","Error"], correct:1, explanation:"`len()` returns the number of items in the list — 3 here." },
  ]
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function renderLives() {
  livesDisplay.innerHTML = [0,1,2].map(i =>
    `<span style="font-size:20px;${i >= lives ? "filter:grayscale(1) opacity(0.35)" : ""}">❤️</span>`
  ).join("");
}

function renderMaze() {
  mazeGrid.style.gridTemplateColumns = `repeat(${COLS}, 44px)`;
  mazeGrid.innerHTML = "";
  const visited = new Set(
    SOLUTION_PATH.slice(0, qIndex + 1).map(p => `${p.r},${p.c}`)
  );
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.style.cssText = "width:44px;height:44px;border:2px solid #5C3D11;display:flex;align-items:center;justify-content:center;font-size:20px;";
      if (MAZE[r][c] === 1)                          cell.style.background = "#5C3D11";
      else if (r === playerPos.r && c === playerPos.c) { cell.style.background="#FDF3DC"; cell.textContent="🐤"; }
      else if (r === GOAL.r && c === GOAL.c)           { cell.style.background="#f59e0b"; cell.textContent="🏁"; }
      else if (visited.has(`${r},${c}`))               cell.style.background = "#fde68a";
      else                                             cell.style.background = "#FDF3DC";
      mazeGrid.appendChild(cell);
    }
  }
}
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderQuestion() {
  answered = false;
  hide(feedback);
  hide(nextBtn);
  const q = questions[qIndex];
  questionText.textContent = q.question; // textContent is already safe, no change needed here
  qNum.textContent  = qIndex + 1;
  qTotal.textContent = questions.length;
  progressBar.style.width = `${(qIndex / questions.length) * 100}%`;
  stepCount.textContent = qIndex;
  stepTotal.textContent = Math.min(questions.length, SOLUTION_PATH.length - 1);

  optionsArea.innerHTML = q.options.map((opt, i) => `
    <button data-index="${i}"
      class="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200
             rounded-xl hover:border-warmOrange hover:bg-orange-50 transition font-semibold">
      <span class="text-deepChocolate">${escapeHtml(opt)}</span>
    </button>
  `).join("");

  optionsArea.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => handleAnswer(parseInt(btn.dataset.index)));
  });
}
function handleAnswer(chosen) {
  if (answered) return;
  answered = true;
  const q    = questions[qIndex];
  const btns = optionsArea.querySelectorAll("button");
  btns.forEach(b => b.disabled = true);

  if (chosen === q.correct) {
    btns[chosen].classList.add("border-green-400","bg-green-50");
    feedback.className = "mt-4 p-3 rounded-xl text-center font-semibold text-sm bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct! ${q.explanation}`;
    const next = SOLUTION_PATH[Math.min(qIndex + 1, SOLUTION_PATH.length - 1)];
    playerPos  = { ...next };
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
    setTimeout(() => { hide(gameScreen); show(loseScreen); }, 1200);
    return;
  }
  show(nextBtn);
}

nextBtn.addEventListener("click", () => {
  qIndex++;
  qIndex >= questions.length ? endGame() : (renderQuestion(), renderMaze());
});

// End Game 
async function endGame() {
  hide(gameScreen);
  show(winScreen);

  if (!auth.currentUser) {
    finalXP.textContent = sessionXP;
    return;
  }

  try {
    const ref  = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);
    const data = snap.data();

    const completed = data.progress?.[course]?.codeMazeLevelsCompleted || [];
    const firstCompletion = !completed.includes(currentLevel);

    if (firstCompletion) {
      const currentXP = data.xp?.[course] || 0;
      const newXP     = currentXP + sessionXP;

      await updateDoc(ref, {
        [`xp.${course}`]:    increment(sessionXP),
        [`level.${course}`]: Math.floor(newXP / 100) + 1,
        [`progress.${course}.codeMazeLevelsCompleted`]: arrayUnion(currentLevel),
      });

      finalXP.textContent = sessionXP;
    } else {
      finalXP.textContent = "0 (already completed)";
    }
  } catch (e) {
    console.error(e);
    finalXP.textContent = sessionXP;
  }
}

//  Level Select loading / refreshing 
function loadLevels() {
  initLevelSelect(course, "Code Maze", "codeMazeLevelsCompleted", startLevel);
}

window.backToLevelSelect = () => {
  hide(winScreen); hide(loseScreen); hide(gameScreen);
  lives = 3;
  loadLevels();
};

backToLevels.addEventListener("click", backToLevelSelect);

window.restartGame = () => {
  lives = 3; sessionXP = 0; qIndex = 0;
  playerPos = { ...START };
  xpDisplay.textContent = 0;
  hide(winScreen); hide(loseScreen);
  show(gameScreen);
  renderLives(); renderMaze(); renderQuestion();
};

function startLevel(lessonOrder, lessonTitleText) {
  currentLevel = lessonOrder;
  lives = 3; sessionXP = 0; qIndex = 0;
  xpDisplay.textContent = 0;
  levelTitle.textContent = `Level ${lessonOrder} – ${lessonTitleText}`;

  questions = (ALL_QUESTIONS[course] || []).filter(
    q => Number(q.lesson) === Number(lessonOrder)
  );

  if (!questions.length) {
    alert("No questions yet for this level!");
    backToLevelSelect();
    return;
  }

  // Build a fresh, randomized maze sized to fit this level's question count.
  const built = buildMaze(questions.length);
  MAZE          = built.maze;
  ROWS          = built.rows;
  COLS          = built.cols;
  SOLUTION_PATH = built.path;
  START         = built.start;
  GOAL          = built.goal;
  playerPos     = { ...START };

  hide(winScreen); hide(loseScreen);
  show(gameScreen);
  renderLives(); renderMaze(); renderQuestion();
}

loadLevels();
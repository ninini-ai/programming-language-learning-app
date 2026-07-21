import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
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
let playerPos = { r: 0, c: 0 };

const MAZE = [
  [0,0,1,0,0,1,0],
  [1,0,1,0,1,0,0],
  [1,0,0,0,1,1,0],
  [1,1,1,0,0,0,0],
  [0,0,0,0,1,1,0],
  [0,1,1,0,0,1,0],
  [0,0,0,0,0,0,0],
];
const ROWS = MAZE.length;
const COLS = MAZE[0].length;
const GOAL  = { r: 6, c: 6 };
const START = { r: 0, c: 0 };

const SOLUTION_PATH = [
  {r:0,c:0},{r:0,c:1},
  {r:1,c:1},{r:2,c:1},{r:2,c:2},{r:2,c:3},
  {r:3,c:3},{r:3,c:4},{r:3,c:5},{r:3,c:6},
  {r:4,c:6},{r:5,c:6},{r:6,c:6}
];

const ALL_QUESTIONS = {
  cpp: [
    { lesson:1, question:"What is C++?", options:["Programming Language","Database","Browser","OS"], correct:0, explanation:"C++ is a programming language." },
    { lesson:1, question:"Which symbol ends a C++ statement?", options:[".",";"," ,",":"], correct:1, explanation:"A semicolon `;` ends every statement." },
    { lesson:2, question:"Which header is needed for cout?", options:["<stdio.h>","<string>","<iostream>","<math.h>"], correct:2, explanation:"`#include <iostream>` enables cout." },
    { lesson:2, question:"What does `int` mean?", options:["Decimal number","Whole number","Text","True/False"], correct:1, explanation:"`int` stores whole numbers." },
    { lesson:3, question:"Which loop runs at least once?", options:["for","while","do-while","if"], correct:2, explanation:"A do-while loop always runs at least once." },
    { lesson:4, question:"What is the index of the first array element?", options:["1","0","-1","Depends"], correct:1, explanation:"Arrays in C++ are zero-indexed." },
    { lesson:5, question:"What does `cin` do?", options:["Prints output","Takes user input","Defines a class","Loops"], correct:1, explanation:"`cin` reads input from the user." },
  ],
  python: [
    { lesson:1, question:"Python is a:", options:["Programming Language","Database","Framework","Compiler"], correct:0, explanation:"Python is a programming language." },
    { lesson:1, question:"How do you print in Python?", options:["echo()","console.log()","print()","System.out.println()"], correct:2, explanation:"`print()` outputs text." },
    { lesson:2, question:"Which symbol starts a Python comment?", options:["//","/*","#","--"], correct:2, explanation:"`#` starts a comment." },
    { lesson:2, question:"How do you create a variable?", options:["int x = 5","var x = 5","x = 5","let x = 5"], correct:2, explanation:"Python uses `x = 5`." },
    { lesson:3, question:"What keyword starts a Python loop?", options:["loop","repeat","for","iterate"], correct:2, explanation:"`for` starts a loop." },
    { lesson:4, question:"How do you define a function?", options:["function greet():","def greet():","fun greet():","greet() =>"], correct:1, explanation:"`def` defines a function." },
    { lesson:5, question:"What does `range(5)` produce?", options:["1 to 5","0 to 5","0 to 4","1 to 4"], correct:2, explanation:"`range(5)` gives 0,1,2,3,4." },
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

function renderQuestion() {
  answered = false;
  hide(feedback);
  hide(nextBtn);
  const q = questions[qIndex];
  questionText.textContent = q.question;
  qNum.textContent  = qIndex + 1;
  qTotal.textContent = questions.length;
  progressBar.style.width = `${(qIndex / questions.length) * 100}%`;
  stepCount.textContent = qIndex;
  stepTotal.textContent = Math.min(questions.length, SOLUTION_PATH.length - 1);

  const DIRS = ["Up","Down","Left","Right"];
  optionsArea.innerHTML = q.options.map((opt, i) => `
    <button data-index="${i}"
      class="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200
             rounded-xl hover:border-warmOrange hover:bg-orange-50 transition font-semibold">
      <span class="bg-warmOrange text-white text-xs font-bold px-2 py-1 rounded-md min-w-[48px] text-center">
        ${DIRS[i % 4]}
      </span>
      <span class="text-deepChocolate">${opt}</span>
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

async function endGame() {
  hide(gameScreen);
  show(winScreen);
  finalXP.textContent = sessionXP;
  if (sessionXP > 0 && auth.currentUser) {
    try {
      const ref  = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      const newXP = (data.xp?.[course] || 0) + sessionXP;
      await updateDoc(ref, {
        [`xp.${course}`]:    increment(sessionXP),
        [`level.${course}`]: Math.floor(newXP / 100) + 1,
      });
    } catch(e) { console.error(e); }
  }
}

window.backToLevelSelect = () => {
  hide(winScreen); hide(loseScreen); hide(gameScreen);
  lives = 3;
  document.getElementById("levelSelectScreen").classList.remove("hidden");
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
  lives = 3; sessionXP = 0; qIndex = 0;
  playerPos = { ...START };
  xpDisplay.textContent = 0;
  levelTitle.textContent = `Level ${lessonOrder} – ${lessonTitleText}`;
  questions = (ALL_QUESTIONS[course] || []).filter(q => q.lesson === lessonOrder);
  if (!questions.length) {
    alert("No questions yet for this level!");
    backToLevelSelect();
    return;
  }
  hide(winScreen); hide(loseScreen);
  show(gameScreen);
  renderLives(); renderMaze(); renderQuestion();
}

initLevelSelect(course, "Code Maze", startLevel);
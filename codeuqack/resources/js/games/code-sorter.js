import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const course = window.COURSE;

// ── Screens ────────────────────────────────────────────────
const lockedScreen = document.getElementById("lockedScreen");
const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");

// ── UI ─────────────────────────────────────────────────────
const taskText     = document.getElementById("taskText");
const blockPool    = document.getElementById("blockPool");
const answerZone   = document.getElementById("answerZone");
const feedback     = document.getElementById("feedback");
const checkBtn     = document.getElementById("checkBtn");
const nextBtn      = document.getElementById("nextBtn");
const xpDisplay    = document.getElementById("xpDisplay");
const finalXP      = document.getElementById("finalXP");
const progressBar  = document.getElementById("progressBar");
const qNum         = document.getElementById("qNum");
const qTotal       = document.getElementById("qTotal");
const levelDisplay = document.getElementById("levelDisplay");

// ── State ──────────────────────────────────────────────────
let puzzles    = [];
let pIndex     = 0;
let sessionXP  = 0;
let userData   = null;
let dragSrc    = null;   // the block being dragged
let dragFrom   = null;   // "pool" or "answer"

// ── All Puzzles ────────────────────────────────────────────
// blocks: shown shuffled to user
// correct: correct order by block INDEX (0-based)

const ALL_PUZZLES = {

  cpp: [
    {
      level: 1,
      task: "Arrange a basic C++ Hello World program",
      blocks: [
        'int main() {',
        '#include <iostream>',
        '    return 0;',
        '    cout << "Hello World";',
        'using namespace std;',
        '}',
      ],
      correct: [1, 4, 0, 3, 2, 5],
    },
    {
      level: 1,
      task: "Arrange: declare an integer and print it",
      blocks: [
        '    cout << x;',
        '#include <iostream>',
        '    int x = 10;',
        'using namespace std;',
        'int main() {',
        '}',
      ],
      correct: [1, 3, 4, 2, 0, 5],
    },

    {
      level: 2,
      task: "Arrange: add two numbers and print the result",
      blocks: [
        '    int sum = a + b;',
        'int main() {',
        '    cout << sum;',
        '#include <iostream>',
        '    int a = 3, b = 4;',
        'using namespace std;',
        '}',
      ],
      correct: [3, 5, 1, 4, 0, 2, 6],
    },
    {
      level: 2,
      task: "Arrange: check if a number is positive using if-else",
      blocks: [
        '    else { cout << "Negative"; }',
        'int main() {',
        '    int n = 5;',
        '#include <iostream>',
        '    if (n > 0) { cout << "Positive"; }',
        'using namespace std;',
        '}',
      ],
      correct: [3, 5, 1, 2, 4, 0, 6],
    },

    {
      level: 3,
      task: "Arrange: print numbers 0 to 4 using a for loop",
      blocks: [
        '}',
        '    for (int i = 0; i < 5; i++) {',
        '#include <iostream>',
        '        cout << i;',
        'int main() {',
        'using namespace std;',
        '    }',
      ],
      correct: [2, 5, 4, 1, 3, 6, 0],
    },

    {
      level: 4,
      task: "Arrange: define and call a function that prints a greeting",
      blocks: [
        'int main() {',
        'void greet() {',
        '#include <iostream>',
        '    greet();',
        '    cout << "Hello!";',
        'using namespace std;',
        '}',
        '}',
      ],
      correct: [2, 5, 1, 4, 6, 0, 3, 7],
    },

    {
      level: 5,
      task: "Arrange: read user input and print it back",
      blocks: [
        '    cin >> name;',
        'int main() {',
        '    cout << "Hello " + name;',
        '#include <iostream>',
        '    string name;',
        'using namespace std;',
        '}',
      ],
      correct: [3, 5, 1, 4, 0, 2, 6],
    },
  ],

  python: [
    {
      level: 1,
      task: "Arrange a basic Python Hello World program",
      blocks: [
        'print("Hello World")',
      ],
      correct: [0],
    },
    {
      level: 1,
      task: "Arrange: store a name and print a greeting",
      blocks: [
        'print("Hello", name)',
        'name = "Alice"',
      ],
      correct: [1, 0],
    },

    {
      level: 2,
      task: "Arrange: add two numbers and print the result",
      blocks: [
        'print(total)',
        'b = 4',
        'total = a + b',
        'a = 3',
      ],
      correct: [3, 1, 2, 0],
    },
    {
      level: 2,
      task: "Arrange: check if age allows voting",
      blocks: [
        '    print("Cannot vote")',
        'age = 20',
        'else:',
        'if age >= 18:',
        '    print("Can vote")',
      ],
      correct: [1, 3, 4, 2, 0],
    },

    {
      level: 3,
      task: "Arrange: print numbers 0 to 4 using a for loop",
      blocks: [
        '    print(i)',
        'for i in range(5):',
      ],
      correct: [1, 0],
    },
    {
      level: 3,
      task: "Arrange: sum a list of numbers",
      blocks: [
        'print(total)',
        'total = 0',
        'for n in numbers:',
        'numbers = [1, 2, 3, 4, 5]',
        '    total = total + n',
      ],
      correct: [3, 1, 2, 4, 0],
    },

    {
      level: 4,
      task: "Arrange: define and call a function",
      blocks: [
        'greet()',
        'def greet():',
        '    print("Hello!")',
      ],
      correct: [1, 2, 0],
    },
    {
      level: 4,
      task: "Arrange: function that returns the square of a number",
      blocks: [
        'print(square(4))',
        'def square(n):',
        '    return n * n',
      ],
      correct: [1, 2, 0],
    },

    {
      level: 5,
      task: "Arrange: read user input and print a greeting",
      blocks: [
        'print("Hello", name)',
        'name = input("Enter your name: ")',
      ],
      correct: [1, 0],
    },
    {
      level: 5,
      task: "Arrange: find the largest number in a list",
      blocks: [
        'print(largest)',
        'largest = max(numbers)',
        'numbers = [3, 7, 2, 9, 1]',
      ],
      correct: [2, 1, 0],
    },
  ],

};

// ── Helpers ────────────────────────────────────────────────
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function getLessonsCompleted() {
  return (userData?.progress?.[course]?.lessonsCompleted || []).length;
}

function getPuzzles() {
  const n = Math.max(1, getLessonsCompleted());
  return ALL_PUZZLES[course].filter(p => p.level <= n);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Make a draggable block element ─────────────────────────
function makeBlock(text, originalIndex) {
  const div = document.createElement("div");
  div.className = "block bg-gray-900 text-green-400 font-mono text-sm px-4 py-3 rounded-xl border-2 border-gray-700 select-none";
  div.textContent = text;
  div.dataset.index = originalIndex;
  div.draggable = true;

  // Desktop drag events
  div.addEventListener("dragstart", onDragStart);
  div.addEventListener("dragend",   onDragEnd);

  // Touch events for mobile
  div.addEventListener("touchstart", onTouchStart, { passive: true });
  div.addEventListener("touchmove",  onTouchMove,  { passive: false });
  div.addEventListener("touchend",   onTouchEnd);

  return div;
}

// ── Render Puzzle ──────────────────────────────────────────
function renderPuzzle() {
  hide(feedback);
  hide(nextBtn);
  show(checkBtn);

  feedback.className = "hidden p-4 rounded-2xl text-center font-semibold mb-4";

  const puzzle = puzzles[pIndex];
  taskText.textContent   = puzzle.task;
  levelDisplay.textContent = puzzle.level;
  qNum.textContent       = pIndex + 1;
  qTotal.textContent     = puzzles.length;
  progressBar.style.width = `${(pIndex / puzzles.length) * 100}%`;

  // Clear zones
  answerZone.innerHTML = "";
  blockPool.innerHTML  = "";

  // Shuffle blocks and add to pool
  const shuffledIndices = shuffle(puzzle.blocks.map((_, i) => i));
  shuffledIndices.forEach(i => {
    blockPool.appendChild(makeBlock(puzzle.blocks[i], i));
  });

  // Drop zone listeners
  [answerZone, blockPool].forEach(zone => {
    zone.addEventListener("dragover",  onDragOver);
    zone.addEventListener("drop",      onDrop);
    zone.addEventListener("dragleave", onDragLeave);
  });
}

// ── Check Answer ───────────────────────────────────────────
checkBtn.addEventListener("click", () => {
  const puzzle   = puzzles[pIndex];
  const children = [...answerZone.children];

  // Must have all blocks placed
  if (children.length !== puzzle.blocks.length) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-yellow-100 text-yellow-700";
    feedback.textContent = "⚠️ Place all code blocks in the answer zone first!";
    show(feedback);
    return;
  }

  const userOrder  = children.map(el => parseInt(el.dataset.index));
  const isCorrect  = userOrder.every((val, i) => val === puzzle.correct[i]);

  if (isCorrect) {
    // Flash green
    children.forEach(el => {
      el.classList.add("correct-flash");
    });
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Perfect! The order is correct.`;
    sessionXP += 15;
    xpDisplay.textContent = sessionXP;
    hide(checkBtn);
    show(nextBtn);
  } else {
    // Flash red, show correct answer briefly
    children.forEach(el => el.classList.add("wrong-flash"));
    setTimeout(() => children.forEach(el => el.classList.remove("wrong-flash")), 800);

    // Show what correct order looks like
    const correctText = puzzle.correct.map(i => puzzle.blocks[i]).join(" → ");
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Not quite! Try rearranging.<br>
      <span class="text-xs font-normal mt-1 block opacity-75">Hint: check the logical flow of the program.</span>`;
  }

  show(feedback);
});

// ── Next Puzzle ────────────────────────────────────────────
nextBtn.addEventListener("click", () => {
  pIndex++;
  if (pIndex >= puzzles.length) {
    endGame();
  } else {
    renderPuzzle();
  }
});

// ── End Game ───────────────────────────────────────────────
async function endGame() {
  hide(gameScreen);
  show(winScreen);
  finalXP.textContent = sessionXP;
  progressBar.style.width = "100%";

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
  pIndex    = 0;
  sessionXP = 0;
  xpDisplay.textContent = 0;
  hide(winScreen);
  show(gameScreen);
  puzzles = getPuzzles();
  renderPuzzle();
};

// ══════════════════════════════════════════════════════════
//  DRAG AND DROP — Desktop
// ══════════════════════════════════════════════════════════

function onDragStart(e) {
  dragSrc  = e.currentTarget;
  dragFrom = dragSrc.parentElement === blockPool ? "pool" : "answer";
  e.dataTransfer.effectAllowed = "move";
  setTimeout(() => dragSrc.classList.add("dragging"), 0);
}

function onDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.currentTarget.classList.add("drag-over");
}

function onDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function onDrop(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove("drag-over");

  if (!dragSrc || dragSrc.parentElement === zone) return;

  // Find if dropped on an existing block inside the zone
  const target = e.target.closest(".block");
  if (target && target !== dragSrc && target.parentElement === zone) {
    zone.insertBefore(dragSrc, target);
  } else {
    zone.appendChild(dragSrc);
  }
}

// ══════════════════════════════════════════════════════════
//  DRAG AND DROP — Touch (mobile)
// ══════════════════════════════════════════════════════════

let touchClone   = null;
let touchSrc     = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function onTouchStart(e) {
  touchSrc = e.currentTarget;
  const touch  = e.touches[0];
  const rect   = touchSrc.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  // Create floating clone
  touchClone = touchSrc.cloneNode(true);
  touchClone.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.85;
    width: ${rect.width}px;
    left: ${touch.clientX - touchOffsetX}px;
    top:  ${touch.clientY - touchOffsetY}px;
    transition: none;
  `;
  document.body.appendChild(touchClone);
  touchSrc.classList.add("dragging");
}

function onTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  touchClone.style.left = `${touch.clientX - touchOffsetX}px`;
  touchClone.style.top  = `${touch.clientY - touchOffsetY}px`;
}

function onTouchEnd(e) {
  if (!touchClone) return;
  touchClone.remove();
  touchClone = null;
  touchSrc.classList.remove("dragging");

  const touch  = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (!target) return;

  // Find which zone was dropped into
  const zone = target.closest("#answerZone, #blockPool");
  if (!zone || zone === touchSrc.parentElement) return;

  const blockTarget = target.closest(".block");
  if (blockTarget && blockTarget !== touchSrc && blockTarget.parentElement === zone) {
    zone.insertBefore(touchSrc, blockTarget);
  } else {
    zone.appendChild(touchSrc);
  }
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap = await getDoc(doc(db, "users", user.uid));
  userData   = snap.data() || {};

  if (getLessonsCompleted() < 1) {
    show(lockedScreen);
    return;
  }

  puzzles = getPuzzles();
  show(gameScreen);
  renderPuzzle();
});
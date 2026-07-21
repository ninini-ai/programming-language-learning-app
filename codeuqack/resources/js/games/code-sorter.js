import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { initLevelSelect } from "./game-levels";

const course = window.COURSE;

const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
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
const backToLevels = document.getElementById("backToLevels");

let puzzles   = [];
let pIndex    = 0;
let sessionXP = 0;
let dragSrc   = null;
let touchClone = null, touchSrc = null, touchOffX = 0, touchOffY = 0;

const ALL_PUZZLES = {
  cpp: [
    { lesson:1, task:"Arrange a basic C++ Hello World program",
      blocks:['int main() {','#include <iostream>','    return 0;','    cout << "Hello World";','using namespace std;','}'],
      correct:[1,4,0,3,2,5] },
    { lesson:1, task:"Arrange: declare an integer and print it",
      blocks:['    cout << x;','#include <iostream>','    int x = 10;','using namespace std;','int main() {','}'],
      correct:[1,3,4,2,0,5] },
    { lesson:2, task:"Arrange: add two numbers and print the result",
      blocks:['    int sum = a + b;','int main() {','    cout << sum;','#include <iostream>','    int a = 3, b = 4;','using namespace std;','}'],
      correct:[3,5,1,4,0,2,6] },
    { lesson:3, task:"Arrange: print numbers 0 to 4 using a for loop",
      blocks:['}','    for (int i = 0; i < 5; i++) {','#include <iostream>','        cout << i;','int main() {','using namespace std;','    }'],
      correct:[2,5,4,1,3,6,0] },
    { lesson:4, task:"Arrange: define and call a function",
      blocks:['int main() {','void greet() {','#include <iostream>','    greet();','    cout << "Hello!";','using namespace std;','}','}'],
      correct:[2,5,1,4,6,0,3,7] },
    { lesson:5, task:"Arrange: read user input and print it back",
      blocks:['    cin >> name;','int main() {','    cout << "Hello " + name;','#include <iostream>','    string name;','using namespace std;','}'],
      correct:[3,5,1,4,0,2,6] },
  ],
  python: [
    { lesson:1, task:"Arrange a basic Python Hello World program",
      blocks:['print("Hello World")'],
      correct:[0] },
    { lesson:1, task:"Arrange: store a name and print a greeting",
      blocks:['print("Hello", name)','name = "Alice"'],
      correct:[1,0] },
    { lesson:2, task:"Arrange: add two numbers and print the result",
      blocks:['print(total)','b = 4','total = a + b','a = 3'],
      correct:[3,1,2,0] },
    { lesson:3, task:"Arrange: print numbers 0 to 4 using a for loop",
      blocks:['    print(i)','for i in range(5):'],
      correct:[1,0] },
    { lesson:4, task:"Arrange: define and call a function",
      blocks:['greet()','def greet():','    print("Hello!")'],
      correct:[1,2,0] },
    { lesson:5, task:"Arrange: read user input and print a greeting",
      blocks:['print("Hello", name)','name = input("Enter your name: ")'],
      correct:[1,0] },
  ]
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBlock(text, originalIndex) {
  const div = document.createElement("div");
  div.className = "block bg-gray-900 text-green-400 font-mono text-sm px-4 py-3 rounded-xl border-2 border-gray-700 select-none cursor-grab";
  div.textContent = text;
  div.dataset.index = originalIndex;
  div.draggable = true;
  div.addEventListener("dragstart", onDragStart);
  div.addEventListener("dragend", onDragEnd);
  div.addEventListener("touchstart", onTouchStart, { passive: true });
  div.addEventListener("touchmove", onTouchMove,  { passive: false });
  div.addEventListener("touchend", onTouchEnd);
  return div;
}

function renderPuzzle() {
  hide(feedback); hide(nextBtn); show(checkBtn);
  const p = puzzles[pIndex];
  taskText.textContent     = p.task;
  levelDisplay.textContent = document.getElementById("levelDisplay").dataset.level || "";
  qNum.textContent         = pIndex + 1;
  qTotal.textContent       = puzzles.length;
  progressBar.style.width  = `${(pIndex / puzzles.length) * 100}%`;
  answerZone.innerHTML = "";
  blockPool.innerHTML  = "";
  shuffle(p.blocks.map((_,i)=>i)).forEach(i => blockPool.appendChild(makeBlock(p.blocks[i], i)));
  [answerZone, blockPool].forEach(zone => {
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("drop",     e => zone === answerZone ? onDropAnswer(e) : onDropPool(e));
    zone.addEventListener("dragleave",() => zone.classList.remove("drag-over"));
  });
}

checkBtn.addEventListener("click", () => {
  const p = puzzles[pIndex];
  const children = [...answerZone.children];
  if (children.length !== p.blocks.length) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-yellow-100 text-yellow-700";
    feedback.textContent = "⚠️ Place all code blocks first!";
    show(feedback); return;
  }
  const userOrder = children.map(el => parseInt(el.dataset.index));
  const isCorrect = userOrder.every((v,i) => v === p.correct[i]);
  if (isCorrect) {
    children.forEach(el => el.classList.add("border-green-400","bg-green-900"));
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Perfect order!`;
    sessionXP += 15; xpDisplay.textContent = sessionXP;
    hide(checkBtn); show(nextBtn);
  } else {
    children.forEach(el => { el.classList.add("border-red-400"); setTimeout(()=>el.classList.remove("border-red-400"),800); });
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Not quite — check the logical flow.`;
  }
  show(feedback);
});

nextBtn.addEventListener("click", () => {
  pIndex++;
  pIndex >= puzzles.length ? endGame() : renderPuzzle();
});

async function endGame() {
  hide(gameScreen); show(winScreen);
  finalXP.textContent = sessionXP;
  progressBar.style.width = "100%";
  if (sessionXP > 0 && auth.currentUser) {
    try {
      const ref  = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      const newXP = (data.xp?.[course] || 0) + sessionXP;
      await updateDoc(ref, { [`xp.${course}`]: increment(sessionXP), [`level.${course}`]: Math.floor(newXP/100)+1 });
    } catch(e) { console.error(e); }
  }
}

window.backToLevelSelect = () => {
  hide(winScreen); hide(gameScreen);
  document.getElementById("levelSelectScreen").classList.remove("hidden");
};
backToLevels.addEventListener("click", backToLevelSelect);

function startLevel(lessonOrder, lessonTitleText) {
  pIndex = 0; sessionXP = 0;
  xpDisplay.textContent = 0;
  document.getElementById("levelDisplay").textContent = `Level ${lessonOrder} – ${lessonTitleText}`;
  document.getElementById("levelDisplay").dataset.level = `Level ${lessonOrder} – ${lessonTitleText}`;
  puzzles = (ALL_PUZZLES[course] || []).filter(p => p.lesson === lessonOrder);
  if (!puzzles.length) { alert("No puzzles yet for this level!"); backToLevelSelect(); return; }
  hide(winScreen); show(gameScreen);
  renderPuzzle();
}

// Drag handlers
function onDragStart(e) { dragSrc = e.currentTarget; e.dataTransfer.effectAllowed = "move"; setTimeout(()=>dragSrc.classList.add("opacity-40"),0); }
function onDragEnd()    { if (dragSrc) dragSrc.classList.remove("opacity-40"); }
function onDropAnswer(e) { e.preventDefault(); answerZone.classList.remove("drag-over"); if (!dragSrc || dragSrc.parentElement === answerZone) return; const t = e.target.closest(".block"); t && t.parentElement === answerZone ? answerZone.insertBefore(dragSrc, t) : answerZone.appendChild(dragSrc); }
function onDropPool(e)   { e.preventDefault(); blockPool.classList.remove("drag-over"); if (!dragSrc) return; blockPool.appendChild(dragSrc); }

function onTouchStart(e) {
  touchSrc = e.currentTarget;
  const t = e.touches[0], rect = touchSrc.getBoundingClientRect();
  touchOffX = t.clientX - rect.left; touchOffY = t.clientY - rect.top;
  touchClone = touchSrc.cloneNode(true);
  touchClone.style.cssText = `position:fixed;pointer-events:none;z-index:9999;opacity:0.85;width:${rect.width}px;left:${t.clientX-touchOffX}px;top:${t.clientY-touchOffY}px;`;
  document.body.appendChild(touchClone); touchSrc.classList.add("opacity-40");
}
function onTouchMove(e) { e.preventDefault(); const t=e.touches[0]; touchClone.style.left=`${t.clientX-touchOffX}px`; touchClone.style.top=`${t.clientY-touchOffY}px`; }
function onTouchEnd(e) {
  if (!touchClone) return;
  touchClone.remove(); touchClone = null; touchSrc.classList.remove("opacity-40");
  const t = e.changedTouches[0], el = document.elementFromPoint(t.clientX, t.clientY);
  if (!el) return;
  const zone = el.closest("#answerZone,#blockPool");
  if (!zone || zone === touchSrc.parentElement) return;
  const target = el.closest(".block");
  target && target !== touchSrc && target.parentElement === zone ? zone.insertBefore(touchSrc, target) : zone.appendChild(touchSrc);
  touchSrc = null;
}

initLevelSelect(course, "Code Sorter", startLevel);
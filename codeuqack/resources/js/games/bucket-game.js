import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const course = window.COURSE;

// ── Screens ─────────────────────────────────────────────
const levelSelectScreen = document.getElementById("levelSelectScreen");
const levelGrid    = document.getElementById("levelGrid");
const lockedScreen = document.getElementById("lockedScreen");
const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
const loseScreen   = document.getElementById("loseScreen");

// ── UI ───────────────────────────────────────────────────
const backToLevels = document.getElementById("backToLevels");
const levelTitleEl = document.getElementById("levelTitle");
const livesDisplay = document.getElementById("livesDisplay");
const qNum         = document.getElementById("qNum");
const qTotal       = document.getElementById("qTotal");
const progressBar  = document.getElementById("progressBar");
const codeLineEl   = document.getElementById("codeLine");
const bucketsRow   = document.getElementById("bucketsRow");
const tokenPool    = document.getElementById("tokenPool");
const placedCount  = document.getElementById("placedCount");
const feedback     = document.getElementById("feedback");
const checkBtn     = document.getElementById("checkBtn");
const nextBtn      = document.getElementById("nextBtn");
const xpDisplay    = document.getElementById("xpDisplay");
const finalXP      = document.getElementById("finalXP");
const xpEarnedLine = document.getElementById("xpEarnedLine");
const practiceLine = document.getElementById("practiceLine");

// ── State ────────────────────────────────────────────────
let questions      = [];
let qIndex         = 0;
let lives          = 3;
let sessionXP      = 0;
let userData       = null;
let currentLevel   = null;
let completedLevels = [];   // levels already awarded XP for this game+course
let isReplay       = false; // true if currentLevel is already in completedLevels

const BUCKET_STYLES = {
  purple: { border: "#a78bfa", bg: "#f5f3ff", text: "#6d28d9", badge: "#7c3aed" },
  blue:   { border: "#60a5fa", bg: "#eff6ff", text: "#1d4ed8", badge: "#2563eb" },
  green:  { border: "#34d399", bg: "#ecfdf5", text: "#065f46", badge: "#059669" },
  orange: { border: "#fb923c", bg: "#fff7ed", text: "#c2410c", badge: "#ea580c" },
};

// ── All Questions (unchanged content, trimmed here for brevity) ─────────────
const ALL_QUESTIONS = { cpp: [ /* ...same as before... */ ], python: [ /* ...same as before... */ ] };

// ── Helpers ──────────────────────────────────────────────
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function getLessonsCompleted() {
  return (userData?.progress?.[course]?.lessonsCompleted || []).length;
}

function getCompletedLevels() {
  return (userData?.progress?.[course]?.games?.bucketGame || []).map(Number);
}

function getAvailableLevels() {
  const n = Math.max(1, getLessonsCompleted());
  const levels = [...new Set(ALL_QUESTIONS[course].map(q => q.level))].filter(l => l <= n);
  return levels.sort((a, b) => a - b);
}

function getQuestionsForLevel(level) {
  return ALL_QUESTIONS[course].filter(q => q.level === level);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Level Select ──────────────────────────────────────────
function renderLevelSelect() {
  hide(gameScreen); hide(winScreen); hide(loseScreen);
  levelGrid.innerHTML = "";

  getAvailableLevels().forEach(lvl => {
    const done = completedLevels.includes(lvl);
    const btn = document.createElement("button");
    btn.className = `p-4 rounded-xl font-bold shadow transition text-center border-2 ${
      done
        ? "bg-green-50 text-green-700 border-green-400"
        : "bg-white text-deepChocolate border-warmOrange hover:bg-warmOrange hover:text-white"
    }`;
    btn.innerHTML = `
      <div class="text-lg">Level ${lvl}</div>
      <div class="text-xs mt-1">${done ? "✅ Completed" : "▶ Play"}</div>
    `;
    btn.addEventListener("click", () => startLevel(lvl));
    levelGrid.appendChild(btn);
  });

  show(levelSelectScreen);
}

function startLevel(lvl) {
  currentLevel = lvl;
  isReplay     = completedLevels.includes(lvl);
  questions    = getQuestionsForLevel(lvl);
  qIndex       = 0;
  lives        = 3;
  sessionXP    = 0;

  xpDisplay.textContent = 0;
  levelTitleEl.textContent = `Level ${lvl}${isReplay ? " (Practice)" : ""}`;

  hide(levelSelectScreen);
  show(gameScreen);
  renderLives();
  renderQuestion();
}

backToLevels.addEventListener("click", renderLevelSelect);

// ── Render Lives ─────────────────────────────────────────
function renderLives() {
  livesDisplay.innerHTML = [0, 1, 2].map(i =>
    `<span class="heart ${i >= lives ? "lost" : ""}">❤️</span>`
  ).join("");
}

function updatePlaced() {
  const q      = questions[qIndex];
  const total  = q.tokens.length;
  const inPool = tokenPool.children.length;
  placedCount.textContent = `${total - inPool} / ${total} placed`;
}

// ── Render Question (unchanged from your version) ─────────
function renderQuestion() {
  hide(feedback);
  hide(nextBtn);
  show(checkBtn);
  feedback.className = "hidden p-4 rounded-2xl text-center font-semibold mb-4 text-sm";

  const q = questions[qIndex];
  codeLineEl.textContent  = q.codeLine;
  qNum.textContent        = qIndex + 1;
  qTotal.textContent      = questions.length;
  progressBar.style.width = `${(qIndex / questions.length) * 100}%`;

  bucketsRow.innerHTML = "";
  q.buckets.forEach(b => {
    const st  = BUCKET_STYLES[b.color];
    const div = document.createElement("div");
    div.className = "bucket p-3";
    div.id = `bucket-${b.id}`;
    div.style.cssText = `border-color:${st.border}; background:${st.bg};`;
    div.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold flex items-center gap-1" style="color:${st.text}">🪣 ${b.label}</span>
        <span class="number-badge text-white text-xs" style="background:${st.badge}" id="count-${b.id}">0</span>
      </div>
      <div class="token-area flex flex-wrap gap-1 min-h-[36px]" id="area-${b.id}"></div>
    `;
    div.addEventListener("dragover",  e => { e.preventDefault(); div.classList.add("drag-over"); div.style.borderStyle = "solid"; });
    div.addEventListener("dragleave", () => { div.classList.remove("drag-over"); div.style.borderStyle = "dashed"; });
    div.addEventListener("drop", e => onDropBucket(e, b.id));
    bucketsRow.appendChild(div);
  });

  tokenPool.innerHTML = "";
  shuffle(q.tokens).forEach(t => tokenPool.appendChild(makeToken(t.text)));
  updatePlaced();

  tokenPool.addEventListener("dragover", e => e.preventDefault());
  tokenPool.addEventListener("drop", onDropPool);
}

function makeToken(text) {
  const span = document.createElement("span");
  span.className = "token bg-warmOrange text-white font-mono font-bold text-sm px-4 py-2 rounded-full border-2 border-yellow-700";
  span.textContent = text;
  span.draggable = true;
  span.dataset.text = text;
  span.addEventListener("dragstart", onDragStart);
  span.addEventListener("dragend",   onDragEnd);
  span.addEventListener("touchstart", onTouchStart, { passive: true });
  span.addEventListener("touchmove",  onTouchMove,  { passive: false });
  span.addEventListener("touchend",   onTouchEnd);
  return span;
}

function makeBucketToken(text, color) {
  const st = BUCKET_STYLES[color];
  const span = document.createElement("span");
  span.className = "bucket-token token";
  span.textContent = text;
  span.dataset.text = text;
  span.draggable = true;
  span.style.cssText = `background:${st.badge}; color:white;`;
  span.addEventListener("dragstart", onDragStart);
  span.addEventListener("dragend",   onDragEnd);
  span.addEventListener("touchstart", onTouchStart, { passive: true });
  span.addEventListener("touchmove",  onTouchMove,  { passive: false });
  span.addEventListener("touchend",   onTouchEnd);
  return span;
}

function updateBucketCount(bucketId) {
  const area  = document.getElementById(`area-${bucketId}`);
  const badge = document.getElementById(`count-${bucketId}`);
  if (area && badge) badge.textContent = area.children.length;
}

// ── Check Answer ─────────────────────────────────────────
checkBtn.addEventListener("click", () => {
  const q = questions[qIndex];

  if (tokenPool.children.length > 0) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 text-sm bg-yellow-100 text-yellow-700";
    feedback.textContent = "⚠️ Place all tokens into buckets first!";
    show(feedback);
    return;
  }

  let allCorrect = true;
  q.buckets.forEach(b => {
    const area = document.getElementById(`area-${b.id}`);
    const placed = [...area.children].map(el => el.dataset.text);
    const expected = q.tokens.filter(t => t.bucket === b.id).map(t => t.text);
    placed.forEach(text => { if (!expected.includes(text)) allCorrect = false; });
    expected.forEach(text => { if (!placed.includes(text)) allCorrect = false; });
  });

  if (allCorrect) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 text-sm bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Perfect! All tokens in the right buckets!`;

    // Only accumulate XP if this level hasn't already been completed once
    if (!isReplay) {
      sessionXP += 15;
      xpDisplay.textContent = sessionXP;
    }

    hide(checkBtn);
    show(nextBtn);
  } else {
    lives--;
    renderLives();
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 text-sm bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Some tokens are in the wrong bucket. Try again!`;

    if (lives <= 0) {
      setTimeout(() => { hide(gameScreen); show(loseScreen); }, 1000);
      return;
    }
  }

  show(feedback);
});

// ── Next ─────────────────────────────────────────────────
nextBtn.addEventListener("click", () => {
  qIndex++;
  if (qIndex >= questions.length) endGame();
  else renderQuestion();
});

// ── End Game ─────────────────────────────────────────────
async function endGame() {
  hide(gameScreen);
  show(winScreen);
  progressBar.style.width = "100%";

  if (isReplay) {
    // Practice round — level already completed once, no XP this time
    hide(xpEarnedLine);
    show(practiceLine);
  } else {
    show(xpEarnedLine);
    hide(practiceLine);
    finalXP.textContent = sessionXP;

    if (auth.currentUser) {
      try {
        const ref = doc(db, "users", auth.currentUser.uid);

        if (sessionXP > 0) {
          await updateDoc(ref, { [`xp.${course}`]: increment(sessionXP) });
        }

        // Mark this level as completed so XP is never awarded for it again
        await updateDoc(ref, {
          [`progress.${course}.games.bucketGame`]: arrayUnion(currentLevel),
        });
        completedLevels.push(currentLevel);

        const snap = await getDoc(ref);
        const data = snap.data();
        const newXP = data.xp?.[course] || 0;
        await updateDoc(ref, { [`level.${course}`]: Math.floor(newXP / 100) + 1 });
      } catch (e) { console.error(e); }
    }
  }
}

// ── Restart (replays current level, respects isReplay) ────
window.restartGame = () => {
  hide(winScreen);
  hide(loseScreen);
  startLevel(currentLevel);
};

// ══════════════════════════════════════════════════════
//  DRAG – Desktop / Touch (unchanged from your version)
// ══════════════════════════════════════════════════════
let dragSrc = null;

function onDragStart(e) {
  dragSrc = e.currentTarget;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragSrc.dataset.text);
  setTimeout(() => dragSrc.classList.add("dragging"), 0);
}
function onDragEnd() { if (dragSrc) dragSrc.classList.remove("dragging"); }

function onDropBucket(e, bucketId) {
  e.preventDefault();
  const bDiv = document.getElementById(`bucket-${bucketId}`);
  bDiv.classList.remove("drag-over");
  bDiv.style.borderStyle = "dashed";
  if (!dragSrc) return;

  const q = questions[qIndex];
  const bData = q.buckets.find(b => b.id === bucketId);
  const area = document.getElementById(`area-${bucketId}`);
  area.appendChild(makeBucketToken(dragSrc.dataset.text, bData.color));
  dragSrc.remove();
  updateBucketCount(bucketId);
  updatePlaced();
  dragSrc = null;
}

function onDropPool(e) {
  e.preventDefault();
  if (!dragSrc) return;
  tokenPool.appendChild(makeToken(dragSrc.dataset.text));
  dragSrc.remove();
  questions[qIndex].buckets.forEach(b => updateBucketCount(b.id));
  updatePlaced();
  dragSrc = null;
}

let touchClone = null, touchSrc = null, touchOffX = 0, touchOffY = 0;

function onTouchStart(e) {
  touchSrc = e.currentTarget;
  const t = e.touches[0];
  const rect = touchSrc.getBoundingClientRect();
  touchOffX = t.clientX - rect.left;
  touchOffY = t.clientY - rect.top;
  touchClone = touchSrc.cloneNode(true);
  touchClone.style.cssText = `position:fixed; pointer-events:none; z-index:9999; opacity:0.85; transition:none; left:${t.clientX - touchOffX}px; top:${t.clientY - touchOffY}px;`;
  document.body.appendChild(touchClone);
  touchSrc.classList.add("dragging");
}
function onTouchMove(e) {
  e.preventDefault();
  const t = e.touches[0];
  touchClone.style.left = `${t.clientX - touchOffX}px`;
  touchClone.style.top  = `${t.clientY - touchOffY}px`;
}
function onTouchEnd(e) {
  if (!touchClone) return;
  touchClone.remove();
  touchClone = null;
  touchSrc.classList.remove("dragging");

  const t = e.changedTouches[0];
  const target = document.elementFromPoint(t.clientX, t.clientY);
  if (!target) { touchSrc = null; return; }

  const bucketDiv = target.closest("[id^='bucket-']");
  if (bucketDiv) {
    const bucketId = bucketDiv.id.replace("bucket-", "");
    const q = questions[qIndex];
    const bData = q.buckets.find(b => b.id === bucketId);
    const area = document.getElementById(`area-${bucketId}`);
    area.appendChild(makeBucketToken(touchSrc.dataset.text, bData.color));
    touchSrc.remove();
    updateBucketCount(bucketId);
    updatePlaced();
  } else if (target.closest("#tokenPool")) {
    tokenPool.appendChild(makeToken(touchSrc.dataset.text));
    touchSrc.remove();
    questions[qIndex].buckets.forEach(b => updateBucketCount(b.id));
    updatePlaced();
  }
  touchSrc = null;
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap = await getDoc(doc(db, "users", user.uid));
  userData = snap.data() || {};

  if (getLessonsCompleted() < 1) {
    show(lockedScreen);
    return;
  }

  completedLevels = getCompletedLevels();
  renderLevelSelect();
});
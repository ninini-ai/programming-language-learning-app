import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const course = window.COURSE;

// ── Screens ─────────────────────────────────────────────
const lockedScreen = document.getElementById("lockedScreen");
const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
const loseScreen   = document.getElementById("loseScreen");

// ── UI ───────────────────────────────────────────────────
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

// ── State ────────────────────────────────────────────────
let questions  = [];
let qIndex     = 0;
let lives      = 3;
let sessionXP  = 0;
let userData   = null;

// Each bucket: { id, label, color, accepts: [token strings] }
// Each question: { level, codeLine, buckets, tokens }
// tokens: [{ text, bucket: bucketId }]

const BUCKET_STYLES = {
  purple: { border: "#a78bfa", bg: "#f5f3ff", text: "#6d28d9", badge: "#7c3aed" },
  blue:   { border: "#60a5fa", bg: "#eff6ff", text: "#1d4ed8", badge: "#2563eb" },
  green:  { border: "#34d399", bg: "#ecfdf5", text: "#065f46", badge: "#059669" },
  orange: { border: "#fb923c", bg: "#fff7ed", text: "#c2410c", badge: "#ea580c" },
};

// ── All Questions ────────────────────────────────────────
const ALL_QUESTIONS = {

  cpp: [
    // Level 1
    {
      level: 1,
      codeLine: "using namespace std;",
      buckets: [
        { id: "keyword",    label: "Keyword",    color: "purple" },
        { id: "identifier", label: "Identifier", color: "blue"   },
      ],
      tokens: [
        { text: "using",     bucket: "keyword"    },
        { text: "namespace", bucket: "keyword"    },
        { text: "std",       bucket: "identifier" },
      ],
    },
    {
      level: 1,
      codeLine: 'cout << "Hello";',
      buckets: [
        { id: "keyword",  label: "Keyword / Object", color: "purple" },
        { id: "operator", label: "Operator",          color: "blue"   },
        { id: "string",   label: "String Literal",    color: "green"  },
      ],
      tokens: [
        { text: "cout",      bucket: "keyword"  },
        { text: "<<",        bucket: "operator" },
        { text: '"Hello"',   bucket: "string"   },
      ],
    },

    // Level 2
    {
      level: 2,
      codeLine: "int x = 10;",
      buckets: [
        { id: "datatype",  label: "Data Type",  color: "purple" },
        { id: "variable",  label: "Variable",   color: "blue"   },
        { id: "value",     label: "Value",       color: "green"  },
      ],
      tokens: [
        { text: "int", bucket: "datatype" },
        { text: "x",   bucket: "variable" },
        { text: "10",  bucket: "value"    },
      ],
    },
    {
      level: 2,
      codeLine: "if (x > 0) { }",
      buckets: [
        { id: "keyword",   label: "Keyword",   color: "purple" },
        { id: "variable",  label: "Variable",  color: "blue"   },
        { id: "operator",  label: "Operator",  color: "green"  },
        { id: "value",     label: "Value",     color: "orange" },
      ],
      tokens: [
        { text: "if", bucket: "keyword"  },
        { text: "x",  bucket: "variable" },
        { text: ">",  bucket: "operator" },
        { text: "0",  bucket: "value"    },
      ],
    },

    // Level 3
    {
      level: 3,
      codeLine: "for (int i = 0; i < 5; i++)",
      buckets: [
        { id: "keyword",  label: "Keyword",  color: "purple" },
        { id: "datatype", label: "Data Type", color: "blue"  },
        { id: "variable", label: "Variable", color: "green"  },
        { id: "value",    label: "Value",    color: "orange" },
      ],
      tokens: [
        { text: "for", bucket: "keyword"  },
        { text: "int", bucket: "datatype" },
        { text: "i",   bucket: "variable" },
        { text: "0",   bucket: "value"    },
        { text: "5",   bucket: "value"    },
      ],
    },

    // Level 4
    {
      level: 4,
      codeLine: "void greet(string name) { }",
      buckets: [
        { id: "returntype", label: "Return Type", color: "purple" },
        { id: "funcname",   label: "Function Name", color: "blue" },
        { id: "paramtype",  label: "Param Type",  color: "green"  },
        { id: "paramname",  label: "Param Name",  color: "orange" },
      ],
      tokens: [
        { text: "void",   bucket: "returntype" },
        { text: "greet",  bucket: "funcname"   },
        { text: "string", bucket: "paramtype"  },
        { text: "name",   bucket: "paramname"  },
      ],
    },

    // Level 5
    {
      level: 5,
      codeLine: "int arr[3] = {1, 2, 3};",
      buckets: [
        { id: "datatype", label: "Data Type", color: "purple" },
        { id: "arrname",  label: "Array Name", color: "blue"  },
        { id: "size",     label: "Size",       color: "green"  },
        { id: "value",    label: "Values",     color: "orange" },
      ],
      tokens: [
        { text: "int", bucket: "datatype" },
        { text: "arr", bucket: "arrname"  },
        { text: "3",   bucket: "size"     },
        { text: "1",   bucket: "value"    },
        { text: "2",   bucket: "value"    },
      ],
    },
  ],

  python: [
    // Level 1
    {
      level: 1,
      codeLine: 'print("Hello")',
      buckets: [
        { id: "function", label: "Function",       color: "purple" },
        { id: "string",   label: "String Literal", color: "blue"   },
      ],
      tokens: [
        { text: "print",   bucket: "function" },
        { text: '"Hello"', bucket: "string"   },
      ],
    },
    {
      level: 1,
      codeLine: "name = \"Alice\"",
      buckets: [
        { id: "variable", label: "Variable",       color: "purple" },
        { id: "string",   label: "String Literal", color: "blue"   },
      ],
      tokens: [
        { text: "name",    bucket: "variable" },
        { text: '"Alice"', bucket: "string"   },
      ],
    },

    // Level 2
    {
      level: 2,
      codeLine: "x = 10 + 5",
      buckets: [
        { id: "variable", label: "Variable", color: "purple" },
        { id: "value",    label: "Value",    color: "blue"   },
        { id: "operator", label: "Operator", color: "green"  },
      ],
      tokens: [
        { text: "x",  bucket: "variable" },
        { text: "10", bucket: "value"    },
        { text: "+",  bucket: "operator" },
        { text: "5",  bucket: "value"    },
      ],
    },
    {
      level: 2,
      codeLine: "if age >= 18:",
      buckets: [
        { id: "keyword",  label: "Keyword",  color: "purple" },
        { id: "variable", label: "Variable", color: "blue"   },
        { id: "operator", label: "Operator", color: "green"  },
        { id: "value",    label: "Value",    color: "orange" },
      ],
      tokens: [
        { text: "if",  bucket: "keyword"  },
        { text: "age", bucket: "variable" },
        { text: ">=",  bucket: "operator" },
        { text: "18",  bucket: "value"    },
      ],
    },

    // Level 3
    {
      level: 3,
      codeLine: "for i in range(5):",
      buckets: [
        { id: "keyword",  label: "Keyword",  color: "purple" },
        { id: "variable", label: "Variable", color: "blue"   },
        { id: "function", label: "Function", color: "green"  },
        { id: "value",    label: "Value",    color: "orange" },
      ],
      tokens: [
        { text: "for",   bucket: "keyword"  },
        { text: "i",     bucket: "variable" },
        { text: "in",    bucket: "keyword"  },
        { text: "range", bucket: "function" },
        { text: "5",     bucket: "value"    },
      ],
    },

    // Level 4
    {
      level: 4,
      codeLine: "def greet(name):",
      buckets: [
        { id: "keyword",   label: "Keyword",        color: "purple" },
        { id: "funcname",  label: "Function Name",  color: "blue"   },
        { id: "paramname", label: "Parameter Name", color: "green"  },
      ],
      tokens: [
        { text: "def",   bucket: "keyword"   },
        { text: "greet", bucket: "funcname"  },
        { text: "name",  bucket: "paramname" },
      ],
    },

    // Level 5
    {
      level: 5,
      codeLine: "numbers = [1, 2, 3]",
      buckets: [
        { id: "variable", label: "Variable",    color: "purple" },
        { id: "value",    label: "List Values", color: "blue"   },
      ],
      tokens: [
        { text: "numbers", bucket: "variable" },
        { text: "1",       bucket: "value"    },
        { text: "2",       bucket: "value"    },
        { text: "3",       bucket: "value"    },
      ],
    },
  ],

};

// ── Helpers ──────────────────────────────────────────────
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function getLessonsCompleted() {
  return (userData?.progress?.[course]?.lessonsCompleted || []).length;
}

function getQuestions() {
  const n = Math.max(1, getLessonsCompleted());
  return ALL_QUESTIONS[course].filter(q => q.level <= n);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Render Lives ─────────────────────────────────────────
function renderLives() {
  livesDisplay.innerHTML = [0, 1, 2].map(i =>
    `<span class="heart ${i >= lives ? "lost" : ""}">❤️</span>`
  ).join("");
}

// ── Update placed counter ────────────────────────────────
function updatePlaced() {
  const q       = questions[qIndex];
  const total   = q.tokens.length;
  const inPool  = tokenPool.children.length;
  placedCount.textContent = `${total - inPool} / ${total} placed`;
}

// ── Render Question ──────────────────────────────────────
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

  // ── Render Buckets ───────────────────────────────────
  bucketsRow.style.gridTemplateColumns =
    q.buckets.length === 2 ? "1fr 1fr" : "1fr 1fr";
  bucketsRow.innerHTML = "";

  q.buckets.forEach(b => {
    const st  = BUCKET_STYLES[b.color];
    const div = document.createElement("div");
    div.className   = "bucket p-3";
    div.id          = `bucket-${b.id}`;
    div.style.cssText = `
      border-color: ${st.border};
      background: ${st.bg};
    `;

    div.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold flex items-center gap-1"
              style="color:${st.text}">
          🪣 ${b.label}
        </span>
        <span class="number-badge text-white text-xs"
              style="background:${st.badge}"
              id="count-${b.id}">0</span>
      </div>
      <div class="token-area flex flex-wrap gap-1 min-h-[36px]"
           id="area-${b.id}"></div>
    `;

    // drag events
    div.addEventListener("dragover",  e => { e.preventDefault(); div.classList.add("drag-over"); div.style.borderStyle="solid"; });
    div.addEventListener("dragleave", ()  => { div.classList.remove("drag-over"); div.style.borderStyle="dashed"; });
    div.addEventListener("drop",      e  => onDropBucket(e, b.id));

    // touch drop handled globally
    bucketsRow.appendChild(div);
  });

  // ── Render Token Pool ────────────────────────────────
  tokenPool.innerHTML = "";
  const shuffled = shuffle(q.tokens);
  shuffled.forEach(t => tokenPool.appendChild(makeToken(t.text)));

  updatePlaced();

  // pool drop zone
  tokenPool.addEventListener("dragover",  e => e.preventDefault());
  tokenPool.addEventListener("drop",      onDropPool);
}

// ── Make Token Element ───────────────────────────────────
function makeToken(text) {
  const span = document.createElement("span");
  span.className   = "token bg-warmOrange text-white font-mono font-bold text-sm px-4 py-2 rounded-full border-2 border-yellow-700";
  span.textContent = text;
  span.draggable   = true;
  span.dataset.text = text;

  span.addEventListener("dragstart", onDragStart);
  span.addEventListener("dragend",   onDragEnd);
  span.addEventListener("touchstart", onTouchStart, { passive: true });
  span.addEventListener("touchmove",  onTouchMove,  { passive: false });
  span.addEventListener("touchend",   onTouchEnd);

  return span;
}

// ── Make Bucket Token (placed, smaller) ─────────────────
function makeBucketToken(text, color) {
  const st   = BUCKET_STYLES[color];
  const span = document.createElement("span");
  span.className    = "bucket-token token";
  span.textContent  = text;
  span.dataset.text = text;
  span.draggable    = true;
  span.style.cssText = `
    background: ${st.badge};
    color: white;
  `;

  span.addEventListener("dragstart", onDragStart);
  span.addEventListener("dragend",   onDragEnd);
  span.addEventListener("touchstart", onTouchStart, { passive: true });
  span.addEventListener("touchmove",  onTouchMove,  { passive: false });
  span.addEventListener("touchend",   onTouchEnd);

  return span;
}

// ── Update bucket count badge ────────────────────────────
function updateBucketCount(bucketId) {
  const area  = document.getElementById(`area-${bucketId}`);
  const badge = document.getElementById(`count-${bucketId}`);
  if (area && badge) badge.textContent = area.children.length;
}

// ── Check Answer ─────────────────────────────────────────
checkBtn.addEventListener("click", () => {
  const q = questions[qIndex];

  // must place all tokens
  if (tokenPool.children.length > 0) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 text-sm bg-yellow-100 text-yellow-700";
    feedback.textContent = "⚠️ Place all tokens into buckets first!";
    show(feedback);
    return;
  }

  let allCorrect = true;

  q.buckets.forEach(b => {
    const area   = document.getElementById(`area-${b.id}`);
    const placed = [...area.children].map(el => el.dataset.text);

    // tokens that should be in this bucket
    const expected = q.tokens
      .filter(t => t.bucket === b.id)
      .map(t => t.text);

    // check every placed token belongs here
    placed.forEach(text => {
      if (!expected.includes(text)) allCorrect = false;
    });

    // check no expected tokens are missing
    expected.forEach(text => {
      if (!placed.includes(text)) allCorrect = false;
    });
  });

  if (allCorrect) {
    feedback.className = "p-4 rounded-2xl text-center font-semibold mb-4 text-sm bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Perfect! All tokens in the right buckets!`;
    sessionXP += 15;
    xpDisplay.textContent = sessionXP;
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
  if (qIndex >= questions.length) {
    endGame();
  } else {
    renderQuestion();
  }
});

// ── End Game ─────────────────────────────────────────────
async function endGame() {
  hide(gameScreen);
  show(winScreen);
  finalXP.textContent     = sessionXP;
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
    } catch (e) { console.error(e); }
  }
}

// ── Restart ──────────────────────────────────────────────
window.restartGame = () => {
  lives     = 3;
  sessionXP = 0;
  qIndex    = 0;
  xpDisplay.textContent = 0;
  hide(winScreen);
  hide(loseScreen);
  show(gameScreen);
  questions = getQuestions();
  renderLives();
  renderQuestion();
};

// ══════════════════════════════════════════════════════
//  DRAG – Desktop
// ══════════════════════════════════════════════════════
let dragSrc = null;

function onDragStart(e) {
  dragSrc = e.currentTarget;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragSrc.dataset.text);
  setTimeout(() => dragSrc.classList.add("dragging"), 0);
}

function onDragEnd() {
  if (dragSrc) dragSrc.classList.remove("dragging");
}

function onDropBucket(e, bucketId) {
  e.preventDefault();
  const bDiv = document.getElementById(`bucket-${bucketId}`);
  bDiv.classList.remove("drag-over");
  bDiv.style.borderStyle = "dashed";
  if (!dragSrc) return;

  const q     = questions[qIndex];
  const bData = q.buckets.find(b => b.id === bucketId);
  const area  = document.getElementById(`area-${bucketId}`);

  area.appendChild(makeBucketToken(dragSrc.dataset.text, bData.color));
  dragSrc.remove();
  updateBucketCount(bucketId);
  updatePlaced();
  dragSrc = null;
}

function onDropPool(e) {
  e.preventDefault();
  if (!dragSrc) return;

  // if dragged from a bucket area, return to pool as orange token
  tokenPool.appendChild(makeToken(dragSrc.dataset.text));
  dragSrc.remove();

  // update whichever bucket lost it
  questions[qIndex].buckets.forEach(b => updateBucketCount(b.id));
  updatePlaced();
  dragSrc = null;
}

// ══════════════════════════════════════════════════════
//  DRAG – Touch
// ══════════════════════════════════════════════════════
let touchClone   = null;
let touchSrc     = null;
let touchOffX    = 0;
let touchOffY    = 0;

function onTouchStart(e) {
  touchSrc = e.currentTarget;
  const t    = e.touches[0];
  const rect = touchSrc.getBoundingClientRect();
  touchOffX  = t.clientX - rect.left;
  touchOffY  = t.clientY - rect.top;

  touchClone = touchSrc.cloneNode(true);
  touchClone.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    opacity:0.85; transition:none;
    left:${t.clientX - touchOffX}px;
    top:${t.clientY - touchOffY}px;
  `;
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

  const t      = e.changedTouches[0];
  const target = document.elementFromPoint(t.clientX, t.clientY);
  if (!target) { touchSrc = null; return; }

  // Dropped on a bucket?
  const bucketDiv = target.closest("[id^='bucket-']");
  if (bucketDiv) {
    const bucketId = bucketDiv.id.replace("bucket-", "");
    const q        = questions[qIndex];
    const bData    = q.buckets.find(b => b.id === bucketId);
    const area     = document.getElementById(`area-${bucketId}`);

    area.appendChild(makeBucketToken(touchSrc.dataset.text, bData.color));
    touchSrc.remove();
    updateBucketCount(bucketId);
    updatePlaced();
  }
  // Dropped on pool?
  else if (target.closest("#tokenPool")) {
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
  userData   = snap.data() || {};

  if (getLessonsCompleted() < 1) {
    show(lockedScreen);
    return;
  }

  questions = getQuestions();
  show(gameScreen);
  renderLives();
  renderQuestion();
});
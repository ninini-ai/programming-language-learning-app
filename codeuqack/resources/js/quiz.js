import { auth, db } from "./firebase";
import {
  doc, getDoc,
  collection, getDocs, query, orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { completeQuiz } from "./gamification";

//URL parsing: /quiz/{course}/{quizId} 
const parts  = window.location.pathname.split("/");  //Splits the current URL into parts
const course = parts[2];  //Gets the course.
const quizId = parts[3];   //getquiz id


const quizNum = parseInt(quizId.replace("quiz", ""));  //remove quiz and converts it into a number.

//Screens from blade
const lockedScreen = document.getElementById("lockedScreen");
const quizScreen   = document.getElementById("quizScreen");
const passScreen   = document.getElementById("passScreen");
const failScreen   = document.getElementById("failScreen");
//Stores references to HTML elements so JavaScript can update them.
// UI 
const quizTitle      = document.getElementById("quizTitle");
const questionText   = document.getElementById("questionText");
const optionsArea    = document.getElementById("optionsArea");
const feedback       = document.getElementById("feedback");
const hintBtn        = document.getElementById("hintBtn");
const hintBox        = document.getElementById("hintBox");
const hintText       = document.getElementById("hintText");
const nextBtn        = document.getElementById("nextBtn");
const progressBar    = document.getElementById("progressBar");
const qCurrent       = document.getElementById("qCurrent");
const qTotalDisplay  = document.getElementById("qTotalDisplay");
const scoreDisplay   = document.getElementById("scoreDisplay");
const scoreTotalDisplay = document.getElementById("scoreTotalDisplay");
const passPct        = document.getElementById("passPct");
const failPct        = document.getElementById("failPct");
const nextLessonBtn  = document.getElementById("nextLessonBtn");

// State 
let questions  = [];  //show quiz questins
let current    = 0;
let score      = 0;
let answered   = false;
let allLessons = [];   // ordered lessons from Firestore

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

// Init
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  //  Get user progress
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const userData = userSnap.data() || {};
  const completedLessons = userData.progress?.[course]?.lessonsCompleted || [];
  const completedQuizzes = userData.progress?.[course]?.quizzesCompleted || [];

  //  Get all lessons ordered
  const snap = await getDocs(
    query(collection(db, "courses", course, "lessons"), orderBy("order"))
  );
  allLessons = [];
  snap.forEach(d => allLessons.push({ id: d.id, ...d.data() }));

  // Lock check:
  // Quiz N requires lessons (N*3 - 2), (N*3 - 1), (N*3) to be completed
  // e.g. quiz1 needs lessons 1,2,3 (indexes 0,1,2)
  const requiredLessons = allLessons.slice(
    (quizNum - 1) * 3,
    quizNum * 3
  );

  const allRequired = requiredLessons.every(l =>
    completedLessons.includes(l.id)
  );

  if (!allRequired) {
    const doneCount = requiredLessons.filter(l =>
      completedLessons.includes(l.id)
    ).length;
    document.getElementById("lockedMsg").textContent =
      `Complete all ${requiredLessons.length} lessons before this quiz. (${doneCount}/${requiredLessons.length} done)`;
    show(lockedScreen);
    return;
  }

  // Set up "Next Lesson" button goes to first lesson after this quiz
  const nextLessonIndex = quizNum * 3; 
  const nextLesson = allLessons[nextLessonIndex];
  if (nextLesson) {
    nextLessonBtn.onclick = () => {
      window.location.href = `/lesson/${course}/${nextLesson.id}`;
    };
  } else {
    // No more lessons .go back to lesson list
    nextLessonBtn.textContent = "Back to Lessons";
    nextLessonBtn.onclick = () => {
      window.location.href = `/lessons/${course}`;
    };
  }

  // Load quiz data
  await loadQuiz();
});

//Load Quiz from JSON 
async function loadQuiz() {
  try {
    const res  = await fetch(`/quiz-data/${course}/${quizId}`);
    const data = await res.json();

    if (!data.questions || !data.questions.length) {
      quizScreen.innerHTML = `<p class="text-center text-gray-500 mt-10">No questions found for this quiz.</p>`;
      show(quizScreen);
      return;
    }

    quizTitle.textContent    = data.title || `Quiz ${quizNum}`;
    questions                = data.questions;
    current                  = 0;
    score                    = 0;
    answered                 = false;

    qTotalDisplay.textContent   = questions.length;
    scoreTotalDisplay.textContent = questions.length;

    show(quizScreen);
    renderQuestion();

  } catch (e) {
    console.error("Quiz load error:", e);
    quizScreen.innerHTML = `<p class="text-center text-red-500 mt-10">Failed to load quiz.</p>`;
    show(quizScreen);
  }
}

// Render Question 
function renderQuestion() {
  answered = false;
  hide(feedback);
  hide(nextBtn);
  hide(hintBox);

  const q = questions[current];

  questionText.textContent      = q.question;  //curr quest
  qCurrent.textContent          = current + 1;  //curr number
  scoreDisplay.textContent      = score;
  progressBar.style.width       = `${(current / questions.length) * 100}%`;

  // Hide hint button if no hint
  if (q.hint) {
    show(hintBtn);
    hintText.textContent = q.hint;
  } else {
    hide(hintBtn);
  }
//Loops through all answer options and creates a button for each one
  optionsArea.innerHTML = q.options.map((opt, i) => `
    <button data-index="${i}"
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

// Handle Answer 
function handleAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q    = questions[current];
  const btns = optionsArea.querySelectorAll(".option-btn");
  btns.forEach(b => b.disabled = true);

  const isCorrect = chosen === q.correct;

  if (isCorrect) {
    score++;
    btns[chosen].classList.add("border-green-400", "bg-green-50", "text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold text-sm bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct! ${q.explanation || ""}`;
  } else {
    btns[chosen].classList.add("border-red-400", "bg-red-50", "text-red-600");
    btns[q.correct].classList.add("border-green-400", "bg-green-50", "text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold text-sm bg-red-100 text-red-600";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Wrong! Correct answer: <strong>${q.options[q.correct]}</strong>. ${q.explanation || ""}`;
  }

  scoreDisplay.textContent = score;
  show(feedback);

  // Last question,show Finish instead of Next
  nextBtn.textContent = current === questions.length - 1
    ? "Finish Quiz"
    : "Next";
  nextBtn.innerHTML = current === questions.length - 1
    ? `Finish Quiz <i class="fa-solid fa-flag-checkered"></i>`
    : `Next <i class="fa-solid fa-arrow-right"></i>`;

  show(nextBtn);
}

//  Next / Finish 
nextBtn.addEventListener("click", async () => {
  current++;

  if (current < questions.length) {
    renderQuestion();
    return;
  }

  // Quiz finished — evaluate 
  await finishQuiz();
});

async function finishQuiz() {
  hide(quizScreen);

  const pct = Math.round((score / questions.length) * 100);

  if (pct >= 60) {
    // PASSED
    passPct.textContent = pct;
    show(passScreen);

    // Award XP (completeQuiz handles the duplicate check)
    await completeQuiz(course, quizId);

  } else {
    // FAILED
    failPct.textContent = pct;
    show(failScreen);
  }
}

//Retry 
window.retryQuiz = () => {
  hide(failScreen);
  current  = 0;
  score    = 0;
  answered = false;
  scoreDisplay.textContent = 0;
  progressBar.style.width  = "0%";
  show(quizScreen);
  renderQuestion();
};

//Hint toggle 
hintBtn.addEventListener("click", () => {
  hintBox.classList.toggle("hidden");
});
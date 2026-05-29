import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { completeQuiz } from "./gamification";
const parts = window.location.pathname.split("/");
const course = parts[2];
const quizId = parts[3];
await completeQuiz(course, quizId);
let questions = [];
let current = 0;
let answered = false;

const questionBox = document.getElementById("questionBox");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

async function loadQuiz() {
  const ref = doc(db, "courses", course, "quizzes", quizId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "<h2>Quiz not found</h2>";
    return;
  }

  const data = snap.data();

  document.getElementById("quizTitle").textContent = data.title;

  questions = data.questions;
  renderQuestion();
}

// SHOW QUESTION
function renderQuestion() {
  answered = false;
  feedback.innerHTML = "";
  nextBtn.classList.add("hidden");

  const q = questions[current];

  let html = `<h2 class="mb-3 font-semibold">${q.question}</h2>`;

  q.options.forEach((opt, index) => {
    html += `
      <button onclick="checkAnswer(${index})"
        class="block w-full text-left p-3 mb-2 bg-softCream rounded hover:bg-skyBlue">
        ${opt}
      </button>
    `;
  });

  questionBox.innerHTML = html;
}

// CHECK ANSWER
window.checkAnswer = (index) => {
  if (answered) return;

  answered = true;

  const q = questions[current];

  if (index === q.correct) {
    feedback.innerHTML = `<span class="text-green-600">Correct ✅</span>`;
  } else {
    feedback.innerHTML = `
      <span class="text-red-500">Wrong ❌</span><br>
      Correct: ${q.options[q.correct]}<br>
      <small>${q.explanation}</small>
    `;
  }

  nextBtn.classList.remove("hidden");
};

// NEXT
nextBtn.onclick = () => {
  current++;

  if (current < questions.length) {
    renderQuestion();
  } else {
import { db, auth } from "./firebase";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

const user = auth.currentUser;
const ref = doc(db, "users", user.uid);

await updateDoc(ref, {
  [`progress.${course}.quizzesCompleted`]: arrayUnion(quizId),
  xp: increment(20)
});

alert("Quiz Completed  +20 XP");
    window.history.back();
  }
};

loadQuiz();
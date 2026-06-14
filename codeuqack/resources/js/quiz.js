import { completeQuiz } from "./gamification";

const parts = window.location.pathname.split("/");

const course = parts[2];
const quizId = parts[3];

let questions = [];
let current = 0;
let score = 0;

const questionBox =
document.getElementById("questionBox");

const feedback =
document.getElementById("feedback");

const nextBtn =
document.getElementById("nextBtn");

async function loadQuiz() {

  const res = await fetch(
    `/quiz-data/${course}/${quizId}`
  );

  const data = await res.json();

  document.getElementById("quizTitle")
    .textContent = data.title;

  questions = data.questions;

  renderQuestion();
}

function renderQuestion() {

  feedback.innerHTML = "";
  nextBtn.classList.add("hidden");

  const q = questions[current];

  questionBox.innerHTML = `
    <h2 class="font-bold mb-3">
      ${q.question}
    </h2>

    <div class="mb-4 text-sm text-blue-600">
      Hint: ${q.hint}
    </div>

    ${q.options.map((opt,index)=>`
      <button
        onclick="checkAnswer(${index})"
        class="block w-full p-3 mb-2 bg-softCream rounded hover:bg-skyBlue">
        ${opt}
      </button>
    `).join("")}
  `;
}

window.checkAnswer = (index)=>{

  const q = questions[current];

  if(index === q.correct){

    score++;

    feedback.innerHTML = `
      <div class="text-green-600">
        Correct ✅
        <br>
        ${q.explanation}
      </div>
    `;
  }
  else{

    feedback.innerHTML = `
      <div class="text-red-500">
        Wrong ❌
        <br>
        Correct:
        ${q.options[q.correct]}
        <br>
        ${q.explanation}
      </div>
    `;
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = async ()=>{

  current++;

  if(current < questions.length){

    renderQuestion();
    return;
  }

  const percent =
    Math.round(
      (score/questions.length)*100
    );

  if(percent >= 60){

    await completeQuiz(
      course,
      quizId
    );

    alert(
      `Passed! ${percent}% (+20 XP)`
    );
  }
  else{

    alert(
      `Failed! ${percent}%`
    );
  }

  history.back();
}

loadQuiz();
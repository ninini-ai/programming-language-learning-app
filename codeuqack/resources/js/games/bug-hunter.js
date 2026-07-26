import { auth, db } from "../firebase";
import {
    doc,
    getDoc,
    updateDoc,
    increment,
    arrayUnion
} from "firebase/firestore";
import { initLevelSelect } from "./game-levels";

const course = window.COURSE;

const gameScreen   = document.getElementById("gameScreen");
const winScreen    = document.getElementById("winScreen");
const codeBlock    = document.getElementById("codeBlock");
const optionsArea  = document.getElementById("optionsArea");
const feedback     = document.getElementById("feedback");
const hintBox      = document.getElementById("hintBox");
const hintText     = document.getElementById("hintText");
const hintBtn      = document.getElementById("hintBtn");
const nextBtn      = document.getElementById("nextBtn");
const xpDisplay    = document.getElementById("xpDisplay");
const rewardMessage =
    document.getElementById("rewardMessage");
const levelTitle   = document.getElementById("levelTitle");
const qNum         = document.getElementById("qNum");
const qTotal       = document.getElementById("qTotal");
const backToLevels = document.getElementById("backToLevels");

let questions    = [];
let currentIndex = 0;
let sessionXP    = 0;
let answered     = false;
let activeLessonOrder = 1;

// ── All questions — lesson field matches lesson order number ──
const ALL_QUESTIONS = {
  cpp: [
    {
      lesson: 1,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World"\n    return 0;\n}`,
      options: ["Missing semicolon after cout statement","Wrong include header","main() has wrong return type","cout is misspelled"],
      correct: 0,
      hint: "Every statement in C++ must end with a specific symbol.",
      explanation: "A semicolon `;` is missing after the cout statement."
    },
    {
      lesson: 1,
      code: `#include <iostream>\nusing namespace std\nint main() {\n    cout << "Hi";\n    return 0;\n}`,
      options: ["Missing semicolon after using namespace std","cout is wrong","return type is wrong","include is missing"],
      correct: 0,
      hint: "Check the line that says 'using namespace std'.",
      explanation: "`using namespace std` must end with a semicolon."
    },
    {
      lesson: 2,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5\n    int y = 10;\n    cout << x + y;\n    return 0;\n}`,
      options: ["Missing semicolon after int x = 5","Wrong variable names","cout should use printf","Missing return statement"],
      correct: 0,
      hint: "Look at the variable declarations carefully.",
      explanation: "`int x = 5` is missing a semicolon at the end."
    },
    {
      lesson: 2,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5;\n    if (x > 3)\n        cout << "Big";\n    else\n        cout << "Small"\n    return 0;\n}`,
      options: ["Missing semicolon after cout << \"Small\"","if condition is wrong","Missing braces around if","else is not allowed"],
      correct: 0,
      hint: "Check every cout statement for the ending symbol.",
      explanation: "The cout in the else branch is missing a semicolon."
    },
    {
      lesson: 3,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 0; i < 5; i++)\n        cout << i\n    return 0;\n}`,
      options: ["Missing semicolon after cout << i","for loop syntax is wrong","i++ should be ++i","Missing include"],
      correct: 0,
      hint: "The output statement inside the loop needs something at the end.",
      explanation: "`cout << i` is missing a semicolon."
    },
    {
      lesson: 4,
      code: `#include <iostream>\nusing namespace std;\nint add(int a, int b) {\n    return a + b\n}\nint main() {\n    cout << add(2, 3);\n    return 0;\n}`,
      options: ["Missing semicolon after return a + b","Function name is wrong","Parameters are wrong","cout is wrong"],
      correct: 0,
      hint: "Check the return statement inside the add function.",
      explanation: "`return a + b` needs a semicolon at the end."
    },
    {
      lesson: 5,
      code: `#include <iostream>\nusing namespace std;\nint main() {\n    int arr[3] = {1, 2, 3};\n    for (int i = 0; i <= 3; i++) {\n        cout << arr[i];\n    }\n    return 0;\n}`,
      options: ["Array index goes out of bounds (i <= 3 should be i < 3)","Array size is wrong","for loop is missing braces","cout is wrong"],
      correct: 0,
      hint: "An array of size 3 has valid indexes 0, 1, 2.",
      explanation: "The condition `i <= 3` causes out-of-bounds access. It should be `i < 3`."
    },
  ],

  python: [
    {
      lesson: 1,
      code: `print("Hello World"`,
      options: ["Missing closing parenthesis","print is misspelled","String has wrong quotes","Missing import"],
      correct: 0,
      hint: "Count the opening and closing brackets.",
      explanation: "`print(` is opened but never closed. Add `)` at the end."
    },
    {
      lesson: 1,
      code: `name = "Alice"\nprint("Hello" + name)`,
      options: ["Missing space — should be \"Hello \" + name","name variable is wrong","print is wrong","Quotes mismatch"],
      correct: 0,
      hint: "What will the output look like without a space?",
      explanation: "\"Hello\" + name gives \"HelloAlice\". Add a space: \"Hello \" + name."
    },
    {
      lesson: 2,
      code: `x = 10\ny = 3\nprint(x / y\n`,
      options: ["Missing closing parenthesis in print","Division operator is wrong","Variable names are wrong","Missing import"],
      correct: 0,
      hint: "Check if all brackets are balanced.",
      explanation: "`print(x / y` is missing the closing `)`."
    },
    {
      lesson: 2,
      code: `age = 18\nif age >= 18\n    print("Adult")`,
      options: ["Missing colon after if condition","Condition is wrong","print is wrong","age variable is wrong"],
      correct: 0,
      hint: "Python if statements need a special symbol at the end.",
      explanation: "A colon `:` is required after every `if` condition."
    },
    {
      lesson: 3,
      code: `for i in range(5)\n    print(i)`,
      options: ["Missing colon after for loop","range is wrong","print is wrong","i is not defined"],
      correct: 0,
      hint: "Like if statements, for loops also need a special ending symbol.",
      explanation: "A colon `:` is missing after `for i in range(5)`."
    },
    {
      lesson: 4,
      code: `def greet(name):\n    print("Hello " + name)\n\ngreet("Alice)\n`,
      options: ["String not closed — missing quote before closing parenthesis","Function name is wrong","print is wrong","def keyword is wrong"],
      correct: 0,
      hint: "Look at the string inside greet() call.",
      explanation: "`\"Alice` is missing the closing `\"`. Should be `\"Alice\"`."
    },
    {
      lesson: 5,
      code: `def add(a, b):\n    return a + b\n\nresult = add(5)\nprint(result)`,
      options: ["add() called with only 1 argument but needs 2","return statement is wrong","print is wrong","result variable is wrong"],
      correct: 0,
      hint: "How many parameters does add() expect?",
      explanation: "`add(a, b)` requires 2 arguments but was called with only 1."
    },
  ]
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function startLevel(lessonOrder, lessonTitleText) {
  activeLessonOrder = lessonOrder;
  sessionXP    = 0;
  currentIndex = 0;
  answered     = false;

  xpDisplay.textContent  = 0;
  levelTitle.textContent = `Level ${lessonOrder} – ${lessonTitleText}`;

  // Filter questions for this lesson number only
  questions = (ALL_QUESTIONS[course] || []).filter(q => q.lesson === lessonOrder);

  if (!questions.length) {
    alert("No questions yet for this level. Check back soon!");
    backToLevelSelect();
    return;
  }

  hide(winScreen);
  show(gameScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  answered = false;
  hide(feedback);
  hide(hintBox);
  hide(nextBtn);

  codeBlock.textContent  = q.code;
  qNum.textContent       = currentIndex + 1;
  qTotal.textContent     = questions.length;

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

function handleAnswer(chosen) {
  if (answered) return;
  answered = true;

  const q    = questions[currentIndex];
  const btns = optionsArea.querySelectorAll(".option-btn");
  btns.forEach(b => b.disabled = true);

  if (chosen === q.correct) {
    btns[chosen].classList.add("border-green-400","bg-green-50","text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold bg-green-100 text-green-700";
    feedback.innerHTML = `<i class="fa-solid fa-check-circle"></i> Correct! ${q.explanation}`;
    sessionXP += 10;
    xpDisplay.textContent = sessionXP;
  } else {
    btns[chosen].classList.add("border-red-400","bg-red-50","text-red-700");
    btns[q.correct].classList.add("border-green-400","bg-green-50","text-green-700");
    feedback.className = "mt-4 p-4 rounded-xl text-center font-semibold bg-red-100 text-red-700";
    feedback.innerHTML = `<i class="fa-solid fa-times-circle"></i> Not quite. ${q.explanation}`;
  }

  show(feedback);
  show(nextBtn);
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    endGame();
  }
});

hintBtn.addEventListener("click", () => {
  hintText.textContent = questions[currentIndex].hint;
  hintBox.classList.toggle("hidden");
});

async function endGame() {

    hide(gameScreen);
    show(winScreen);

    if (!auth.currentUser) return;

    try {

        const ref = doc(db, "users", auth.currentUser.uid);

        const snap = await getDoc(ref);

        const data = snap.data();

        const completed =
            data.progress?.[course]?.bugHunterLevelsCompleted || [];

        const firstCompletion =
            !completed.includes(activeLessonOrder);

        if (firstCompletion) {

            const currentXP =
                data.xp?.[course] || 0;

            const newXP =
                currentXP + sessionXP;

            const newLevel =
                Math.floor(newXP / 100) + 1;

            await updateDoc(ref, {

                [`xp.${course}`]:
                    increment(sessionXP),

                [`level.${course}`]:
                    newLevel,

                [`progress.${course}.bugHunterLevelsCompleted`]:
                    arrayUnion(activeLessonOrder)

            });

            rewardMessage.innerHTML =
                `+${sessionXP} XP Earned`;

        }
        else {

            rewardMessage.innerHTML = `
                <span class="text-green-600">
                    <i class="fa-solid fa-circle-check"></i>
                    Level already completed.<br>
                    No XP awarded.
                </span>
            `;

        }

    }
    catch (e) {

        console.error(e);

    }

}

// ── Level Select loading / refreshing ─────────────────────
// Reusable so we can call it again after finishing a level or
// hitting "Back to Levels" / "Play Again", instead of doing a
// full page reload. This makes newly-completed / newly-unlocked
// levels show up immediately.
function loadLevels() {
  initLevelSelect(
      course,
      "Bug Hunter",
      "bugHunterLevelsCompleted",
      (lessonOrder, lessonTitle) => {
        startLevel(lessonOrder, lessonTitle);
      }
  );
}

// Both the "Back to Levels" button and the win screen's
// "Play Again" button (onclick="restartGame()") need a handler.
// Previously only backToLevelSelect existed and it did a hard
// location.reload() — restartGame() didn't exist at all, so
// "Play Again" would silently fail with a ReferenceError.
window.backToLevelSelect = () => {
    hide(gameScreen);
    hide(winScreen);
    loadLevels();
};

window.restartGame = () => {
    hide(winScreen);
    hide(gameScreen);
    loadLevels();
};

backToLevels.addEventListener("click", backToLevelSelect);

// ── Init ──────────────────────────────────────────────────
loadLevels();
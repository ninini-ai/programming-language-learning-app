// lessons.js
import { auth, db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const course = window.location.pathname.split("/")[2];  //current course determinecpp or python
const list   = document.getElementById("lessonList");

document.getElementById("courseTitle").textContent =
  course.toUpperCase() + " Course";

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  // Get users completed lessons and quizzes for this course
  const userSnap = await getDoc(doc(db, "users", user.uid)); //read data(loggedin)
  const userData = userSnap.data() || {};

  const completedLessons =
    userData.progress?.[course]?.lessonsCompleted || [];

  const completedQuizzes =
    userData.progress?.[course]?.quizzesCompleted || [];

  // Get all lessons in order
  const q = query(
    collection(db, "courses", course, "lessons"),
    orderBy("order")
  );

  const snapshot = await getDocs(q);//download lesson docs

  const lessons = [];

  snapshot.forEach(docSnap => {
    lessons.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  list.innerHTML = "";

  let count = 0;

  lessons.forEach((lesson, index) => {
    count++;
    const isFirst = index === 0; 
    let isUnlocked = false;

    if (isFirst) {
      // First lesson is always unlocked
      isUnlocked = true;

    } else {
      // Previous lesson must be completed
      const prevLesson = lessons[index - 1];

      const previousLessonCompleted =
        completedLessons.includes(prevLesson?.id);

      // If this lesson comes immediately after a quiz
      if (index % 3 === 0) {

        // quiz after 3 lessons
        const quizNum = index / 3;
        const quizId = `quiz${quizNum}`;
        const quizCompleted =
          completedQuizzes.includes(quizId);

        isUnlocked =
          previousLessonCompleted &&
          quizCompleted;

      } else {
        // Normal lesson
        isUnlocked = previousLessonCompleted;
      }
    }

    const isCompleted =
      completedLessons.includes(lesson.id);

    list.innerHTML += `
      <div
        ${isUnlocked ? `onclick="openLesson('${lesson.id}')"` : ""}
        class="flex items-center justify-between p-4 rounded-lg transition
          ${isUnlocked
            ? "bg-softCream cursor-pointer hover:bg-skyBlue"
            : "bg-gray-200 cursor-not-allowed opacity-60"}">

        <div class="flex items-center gap-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full text-white
            ${isCompleted
              ? "bg-green-500"
              : isUnlocked
                ? "bg-warmOrange"
                : "bg-gray-400"}">

            ${isCompleted
              ? '<i class="fa-solid fa-check"></i>'
              : count}
          </div>

          <span class="${isUnlocked
            ? 'text-deepChocolate'
            : 'text-gray-500'} font-semibold">

            ${lesson.title}

          </span>
        </div>

        <i class="fa-solid ${
          isUnlocked
            ? 'fa-play text-warmOrange'
            : 'fa-lock text-gray-400'
        }"></i>

      </div>
    `;
    if (count % 3 === 0) {

      const quizNum = count / 3;
      const quizId = `quiz${quizNum}`;

      // Quiz only unlocks when the 3rd lesson is completed
      const quizUnlocked =
        completedLessons.includes(lesson.id);

      const quizCompleted =
        completedQuizzes.includes(quizId);

      list.innerHTML += `
        <div
          ${quizUnlocked ? `onclick="openQuiz('${quizId}')"` : ""}
          class="flex items-center justify-between p-4 rounded-lg transition
            ${quizUnlocked
              ? "bg-warmOrange cursor-pointer hover:bg-skyBlue"
              : "bg-gray-200 cursor-not-allowed opacity-60"}">

          <div class="flex items-center gap-3">

            <i class="fa-solid ${
              quizCompleted
                ? 'fa-circle-check'
                : 'fa-trophy'
            } text-xl ${
              quizUnlocked
                ? 'text-softCream'
                : 'text-gray-400'
            }"></i>

            <span class="font-semibold ${
              quizUnlocked
                ? 'text-deepChocolate'
                : 'text-gray-500'
            }">

              Take Quiz ${quizNum}

            </span>
          </div>

          <i class="fa-solid ${
            quizUnlocked
              ? 'fa-play text-warmOrange'
              : 'fa-lock text-gray-400'
          }"></i>

        </div>
      `;
    }
  });
});

// NAVIGATION
window.openLesson = (id) => {
  window.location.href = `/lesson/${course}/${id}`;
};

window.openQuiz = (quizId) => {
  window.location.href = `/quiz/${course}/${quizId}`;
};
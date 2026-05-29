import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

const course = window.location.pathname.split("/")[2];
const list = document.getElementById("lessonList");

document.getElementById("courseTitle").textContent =
  course.toUpperCase() + " Course";

async function loadLessons() {
  const q = query(
    collection(db, "courses", course, "lessons"),
    orderBy("order")
  );

  const snapshot = await getDocs(q);

  let count = 0;

  snapshot.forEach(docSnap => {
    const lesson = docSnap.data();
    count++;

    // LESSON CARD
    list.innerHTML += `
      <div onclick="openLesson('${docSnap.id}')"
        class="flex items-center justify-between p-4 bg-softCream rounded-lg cursor-pointer hover:bg-skyBlue">
        
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-warmOrange text-white flex items-center justify-center rounded-full">
            ${count}
          </div>
          <span>${lesson.title}</span>
        </div>

        <i class="fa-solid fa-play text-warmOrange"></i>
      </div>
    `;

    if (count % 3 === 0) {
      const quizNum = count / 3;

     list.innerHTML += `
  <div onclick="openQuiz('quiz${quizNum}')"
    class="flex items-center justify-between p-4 bg-warmOrange rounded-lg cursor-pointer hover:bg-skyBlue transition">
    
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-trophy text-xl text-softCream"></i>
      <span class="font-semibold text-deepChocolate">Take Quiz ${quizNum}</span>
    </div>

    <i class="fa-solid fa-play text-warmOrange"></i>
  </div>
`;
    }
  });
}

// NAVIGATION
window.openLesson = (id) => {
  window.location.href = `/lesson/${course}/${id}`;
};

window.openQuiz = (quizId) => {
  window.location.href = `/quiz/${course}/${quizId}`;
};

loadLessons();
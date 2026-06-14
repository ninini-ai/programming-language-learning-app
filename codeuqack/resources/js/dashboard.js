import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const xpEl = document.getElementById("xp");
const levelEl = document.getElementById("level");
const streakEl = document.getElementById("streak");
const userNameEl = document.getElementById("userName");
const progressArea = document.getElementById("progressArea");
const badgesArea = document.getElementById("badgesArea");
const historyArea = document.getElementById("historyArea");
const certificateArea = document.getElementById("certificateArea");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap = await getDoc(doc(db, "users", user.uid));
 const data = snap.data() || {};
data.progress = data.progress || {};
data.badges = data.badges || [];
userNameEl.textContent = data.name || user.email;
  // -------------------
  // BASIC INFO
  // -------------------
const cppXP =
data.xp?.cpp || 0;

const pythonXP =
data.xp?.python || 0;

xpEl.innerHTML = `
CPP: ${cppXP}<br>
Python: ${pythonXP}
`;
  levelEl.textContent = data.level || 1;
  streakEl.textContent = (data.streak?.count || 0) + " days";

  // -------------------
  // PROGRESS
  // -------------------
  progressArea.innerHTML = "";

for (let course in data.progress) {
  const courseData = data.progress[course] || {
    lessonsCompleted: [],
    quizzesCompleted: []
  };

  const lessons = courseData.lessonsCompleted.length;
  const quizzes = courseData.quizzesCompleted.length;

const totalLessons = 10;
const totalQuizzes = 3;

const totalItems =
 totalLessons +
 totalQuizzes;
  const done = lessons + quizzes;
  const percent = Math.floor((done / totalItems) * 100);

 progressArea.innerHTML += `
<div class="mb-3">

<p class="font-bold">
${course.toUpperCase()}
</p>

<p>
Lessons:
${lessons}
</p>

<p>
Quizzes:
${quizzes}
</p>

<p>
Progress:
${percent}%
</p>

</div>
`;
}
  // -------------------
  // BADGES
  // -------------------
const totalXP =
 (data.xp?.cpp || 0)
 +
 (data.xp?.python || 0);

let badgeImage =
 "/images/bronze.png";

let badgeText =
 "Bronze";

if(totalXP >= 100){
 badgeImage =
 "/images/silver.png";
 badgeText =
 "Silver";
}

if(totalXP >= 250){
 badgeImage =
 "/images/gold.png";
 badgeText =
 "Gold";
}

if(totalXP >= 500){
 badgeImage =
 "/images/platinum.png";
 badgeText =
 "Platinum";
}

document.querySelector(
 'img[alt="Badge"]'
).src = badgeImage;

badgesArea.innerHTML =
 badgeText;
  // -------------------
  // HISTORY
  // -------------------
  historyArea.innerHTML = "";

  let history = [];

  for (let course in data.progress) {
    data.progress[course].lessonsCompleted.forEach(l => {
      history.push(`Completed ${course} lesson`);
    });

    data.progress[course].quizzesCompleted.forEach(q => {
      history.push(`Completed ${course} quiz`);
    });
  }

  historyArea.innerHTML =
    history.length ? history.slice(-5).join("<br>") : "No activity yet";

// -------------------
// CERTIFICATES (OLD LOGIC - ALWAYS SHOW)
// -------------------
certificateArea.innerHTML = "";

const name = encodeURIComponent(data.name || "User");
const courses = data.selectedCourses || [];

if (!courses.length) {
  certificateArea.innerHTML =
    "<p class='text-gray-500'>No courses registered</p>";
} else {
  courses.forEach(course => {
    const label =
      course === "cpp"
        ? "C++ Certificate"
        : "Python Certificate";

    certificateArea.innerHTML += `
      <a href="/certificate/${course}?name=${name}"
         class="bg-warmOrange text-white px-4 py-2 rounded hover:bg-skyBlue transition inline-block">
         Download ${label}
      </a>
    `;
  });
}
});
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
  xpEl.textContent = data.xp || 0;
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

  const totalItems = 10;
  const done = lessons + quizzes;
  const percent = Math.floor((done / totalItems) * 100);

  progressArea.innerHTML += `
    <div>
      <p class="text-2xl font-bold text-deepChocolate">
        ${course.toUpperCase()} - ${percent}%
      </p>
      <p class="font-semibold text-deepChocolate">
        Progress
      </p>
    </div>
  `;
}
  // -------------------
  // BADGES
  // -------------------
  if (!data.badges.length) {
  badgesArea.innerHTML = `
    <span class="font-semibold">
      No Badge
    </span>
  `;
} else {
  badgesArea.innerHTML = `
    <span class="font-semibold">
      ${data.badges[data.badges.length - 1]}
    </span>
  `;
}

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
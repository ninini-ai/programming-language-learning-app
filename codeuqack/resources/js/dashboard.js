import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const userNameEl  = document.getElementById("userName");
const courseTabs  = document.getElementById("courseTabs");
const coursePanel = document.getElementById("coursePanel");

const COURSE_LABELS = { cpp: "C++", python: "Python" };
const TOTAL_LESSONS = 10;
const TOTAL_QUIZZES = 3;

function getBadge(xp) {
  const imgs = window.APP_IMAGES;
  if (xp >= 500) return { text: "Platinum", img: imgs.platinum };
  if (xp >= 250) return { text: "Gold",     img: imgs.gold };
  if (xp >= 100) return { text: "Silver",   img: imgs.silver };
  return           { text: "Bronze",   img: imgs.bronze };
}

function renderCourse(course, data, userName) {
  const progress    = data.progress?.[course] || {};
  const lessons     = (progress.lessonsCompleted || []).length;
  const quizzes     = (progress.quizzesCompleted || []).length;
  const xp          = data.xp?.[course] || 0;
  const level       = data.level?.[course] || 1;
  const streak      = data.streak?.count || 0;
  const done        = lessons + quizzes;
  const total       = TOTAL_LESSONS + TOTAL_QUIZZES;
  const percent     = Math.floor((done / total) * 100);
  const badge       = getBadge(xp);
  const label       = COURSE_LABELS[course] || course.toUpperCase();
  const nameEncoded = encodeURIComponent(userName);
  const imgs        = window.APP_IMAGES;

  let historyItems = [];
  (progress.lessonsCompleted || []).forEach(() =>
    historyItems.push(`Completed a ${label} lesson`)
  );
  (progress.quizzesCompleted || []).forEach(() =>
    historyItems.push(`Completed a ${label} quiz`)
  );

  const historyHtml = historyItems.length
    ? historyItems.slice(-5).map(h =>
        `<p class="text-deepChocolate font-semibold">${h}</p>`
      ).join("")
    : `<p class="text-gray-400">No activity yet</p>`;

  return `
    <!-- STAT CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      <div class="bg-softCream rounded-2xl p-5 flex flex-col items-center text-center shadow-md">
        <img src="${imgs.streak}" class="w-12 h-12 object-contain mb-2" alt="Streak">
        <p class="text-2xl font-bold text-deepChocolate">${streak} days</p>
        <p class="font-semibold text-deepChocolate">Streak</p>
      </div>

      <div class="bg-softCream rounded-2xl p-5 flex flex-col items-center text-center shadow-md">
        <img src="${imgs.xp}" class="w-12 h-12 object-contain mb-2" alt="XP">
        <p class="text-2xl font-bold text-deepChocolate">${xp} XP</p>
        <p class="font-semibold text-deepChocolate">Level ${level}</p>
      </div>

      <div class="bg-softCream rounded-2xl p-5 flex flex-col items-center text-center shadow-md">
        <img src="${badge.img}" class="w-12 h-12 object-contain mb-2" alt="Badge">
        <p class="text-2xl font-bold text-deepChocolate">${badge.text}</p>
        <p class="font-semibold text-deepChocolate">Badge</p>
      </div>

      <div class="bg-softCream rounded-2xl p-5 flex flex-col items-center text-center shadow-md">
        <img src="${imgs.percent}" class="w-12 h-12 object-contain mb-2" alt="Progress">
        <p class="text-2xl font-bold text-deepChocolate">${percent}%</p>
        <p class="font-semibold text-deepChocolate">Progress</p>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-warmOrange h-2 rounded-full" style="width:${percent}%"></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">${lessons} lessons · ${quizzes} quizzes</p>
      </div>

    </div>

    <!-- HISTORY + CERTIFICATE -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div class="bg-softCream rounded-[30px] p-8 shadow-md min-h-[200px]">
        <div class="flex flex-col items-center">
          <img src="${imgs.history}" class="w-14 h-14 mb-4 object-contain" alt="History">
          <h2 class="text-2xl font-bold text-deepChocolate mb-4">Learning History</h2>
          <div class="text-center space-y-1">${historyHtml}</div>
        </div>
      </div>

      <div class="bg-softCream rounded-[30px] p-8 shadow-md min-h-[200px]">
        <div class="flex flex-col items-center">
          <img src="${imgs.certificate}" class="w-14 h-14 mb-4 object-contain" alt="Certificate">
          <h2 class="text-2xl font-bold text-deepChocolate mb-4">Certificate</h2>
          <a href="/certificate/${course}?name=${nameEncoded}"
             class="bg-warmOrange text-white px-6 py-2 rounded-lg hover:bg-skyBlue transition font-semibold">
            Download ${label} Certificate
          </a>
        </div>
      </div>

    </div>
  `;
}

const ACTIVE_TAB   = "px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition";
const INACTIVE_TAB = "px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition";

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const snap     = await getDoc(doc(db, "users", user.uid));
  const data     = snap.data() || {};
  const courses  = data.selectedCourses || [];
  const userName = data.name || user.email;

  userNameEl.textContent = userName;

  if (!courses.length) {
    coursePanel.innerHTML = `
      <p class="text-center text-gray-500">
        No courses enrolled.
        <a href="/auth" class="text-indigo-500 underline">Go back and select courses.</a>
      </p>`;
    return;
  }

  // Render tabs
  courseTabs.classList.remove("hidden");
  courseTabs.innerHTML = courses.map((c, i) => `
    <button
      data-course="${c}"
      class="tab-btn ${i === 0 ? ACTIVE_TAB : INACTIVE_TAB}">
      ${COURSE_LABELS[c] || c.toUpperCase()}
    </button>
  `).join("");

  // Show first course by default
  coursePanel.innerHTML = renderCourse(courses[0], data, userName);

  // Tab click handler
  courseTabs.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.course;

      courseTabs.querySelectorAll(".tab-btn").forEach(b => {
        b.className = "tab-btn " + (b.dataset.course === selected ? ACTIVE_TAB : INACTIVE_TAB);
      });

      coursePanel.innerHTML = renderCourse(selected, data, userName);
    });
  });
});
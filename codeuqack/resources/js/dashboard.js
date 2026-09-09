//dashboard.js
import { auth, db } from "./firebase";
import {
  doc, getDoc, updateDoc,
  collection, getDocs, query, orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const userNameEl  = document.getElementById("userName");
const courseTabs  = document.getElementById("courseTabs");
const coursePanel = document.getElementById("coursePanel");

const COURSE_LABELS = { cpp: "C++", python: "Python" };
const ACTIVE_TAB    = "tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition";
const INACTIVE_TAB  = "tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition";

function getBadge(xp) {
  const imgs = window.APP_IMAGES;
  if (xp >= 500) return { text: "Platinum", img: imgs.platinum };
  if (xp >= 250) return { text: "Gold",     img: imgs.gold };
  if (xp >= 100) return { text: "Silver",   img: imgs.silver };
  return           { text: "Bronze",   img: imgs.bronze };
}

function renderCourse(course, data, userName) {
  const progress  = data.progress?.[course] || {};
  const lessons   = (progress.lessonsCompleted || []).length;
  const quizzes   = (progress.quizzesCompleted || []).length;
  const xp        = data.xp?.[course] || 0;
  const level     = data.level?.[course] || 1;
  const streak    = data.streak?.count || 0;
  const badge     = getBadge(xp);
  const label     = COURSE_LABELS[course] || course.toUpperCase();
  const imgs      = window.APP_IMAGES;

  let historyItems = []; // histpry list
  (progress.lessonsCompleted || []).forEach(() =>
    historyItems.push(`Completed a ${label} lesson`)
  );
  (progress.quizzesCompleted || []).forEach(() =>
    historyItems.push(`Completed a ${label} quiz`)
  );
  const historyHtml = historyItems.length
    ? historyItems.slice(-5).map(h =>  //last 5 history items
        `<p class="text-deepChocolate font-semibold">${h}</p>`
      ).join("")
    : `<p class="text-gray-400">No activity yet</p>`;

  return `
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

      <div class="bg-softCream rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md min-h-[180px] hover:shadow-lg transition-all duration-300">
        <img src="${imgs.streak}" class="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-3" alt="Streak">
        <p class="text-xl sm:text-2xl font-bold text-deepChocolate">${streak} days</p>
        <p class="font-semibold text-deepChocolate">Streak</p>
      </div>

      <div class="bg-softCream rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md min-h-[180px] hover:shadow-lg transition-all duration-300">
        <img src="${imgs.xp}" class="w-12 h-12 object-contain mb-2" alt="XP">
        <p class="text-xl sm:text-2xl font-bold text-deepChocolate">${xp} XP</p>
        <p class="font-semibold text-deepChocolate">Level ${level}</p>
      </div>

      <div class="bg-softCream rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md min-h-[180px] hover:shadow-lg transition-all duration-300">
        <img src="${badge.img}" class="w-12 h-12 object-contain mb-2" alt="Badge">
        <p class="text-xl sm:text-2xl font-bold text-deepChocolate">${badge.text}</p>
        <p class="font-semibold text-deepChocolate">Badge</p>
      </div>

<div class="bg-softCream rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md min-h-[180px] hover:shadow-lg transition-all duration-300">
        <img src="${imgs.percent}" class="w-12 h-12 object-contain mb-2" alt="Progress">
        <p class="text-xl sm:text-2xl font-bold text-deepChocolate">${lessons} lessons</p>
        <p class="font-semibold text-deepChocolate">${quizzes} quizzes done</p>
      </div>

    </div>

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
          <div id="certArea-${course}" class="text-center">
            <i class="fa-solid fa-spinner fa-spin text-warmOrange text-xl"></i>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ── Certificate — async, checks Firestore lesson count
async function buildCertBtn(course, data, userName) {
  const containerEl = document.getElementById(`certArea-${course}`);
  if (!containerEl) return;

  const progress     = data.progress?.[course] || {};
  const lessonsCount = (progress.lessonsCompleted || []).length;
  const quizzesCount = (progress.quizzesCompleted || []).length;

  // Get total lessons for this course from Firestore
  const lessonSnap  = await getDocs(
    query(collection(db, "courses", course, "lessons"), orderBy("order"))
  );
  const totalLessons = lessonSnap.size;
  const totalQuizzes = Math.floor(totalLessons / 3);
  const allDone      = lessonsCount >= totalLessons && quizzesCount >= totalQuizzes;

  if (!allDone) {
    const remaining = (totalLessons - lessonsCount) + (totalQuizzes - quizzesCount);
    containerEl.innerHTML = `
      <div class="text-center text-gray-500 text-sm">
        <i class="fa-solid fa-lock text-warmOrange text-2xl mb-2 block"></i>
        Complete all lessons &amp; quizzes to unlock.<br>
        <span class="font-semibold text-warmOrange mt-1 block">
          ${remaining} item(s) remaining
        </span>
      </div>
    `;
    return;
  }

  // Determine cert date, saved once, never changes
  let certDate = data.certificates?.[course];

  if (!certDate) {
    certDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        [`certificates.${course}`]: certDate
      });
    }
  }

  const nameEncoded = encodeURIComponent(userName);
  const dateEncoded = encodeURIComponent(certDate);
  const label       = course === "cpp" ? "C++ Programming" : "Python Programming";

  containerEl.innerHTML = `
    <a href="/certificate/${course}?name=${nameEncoded}&date=${dateEncoded}"
       target="_blank"
       class="inline-flex items-center gap-2 bg-warmOrange text-white
              px-6 py-3 rounded-lg hover:bg-skyBlue transition font-semibold">
      <i class="fa-solid fa-download"></i>
      Download ${label} Certificate
    </a>
    <p class="text-xs text-gray-400 mt-2 text-center">Earned on: ${certDate}</p>
  `;
}

// Main 
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
  courseTabs.classList.remove("hidden");  //buttons
  courseTabs.innerHTML = courses.map((c, i) => `
    <button data-course="${c}" class="tab-btn ${i === 0 ? ACTIVE_TAB : INACTIVE_TAB}">
      ${COURSE_LABELS[c] || c.toUpperCase()}
    </button>
  `).join("");

  // Show first course
  coursePanel.innerHTML = renderCourse(courses[0], data, userName);
  buildCertBtn(courses[0], data, userName);

  // Tab switching
  courseTabs.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.course;

      courseTabs.querySelectorAll(".tab-btn").forEach(b => {
        b.className = "tab-btn " + (b.dataset.course === selected ? ACTIVE_TAB : INACTIVE_TAB);
      });

      coursePanel.innerHTML = renderCourse(selected, data, userName);
      buildCertBtn(selected, data, userName);
    });
  });
});


const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {
    profileBtn.onclick = () => {
        window.location.href = "/profile";
    };
}
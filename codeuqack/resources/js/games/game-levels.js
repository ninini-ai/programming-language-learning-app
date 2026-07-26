import { auth, db } from "../firebase";
import {
  collection, getDocs, doc, getDoc, query, orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Loads lessons from Firestore + user progress,
 * renders a level select screen, then calls onLevelStart(lessonOrder, lessonTitle)
 * when the user picks an unlocked level.
 *
 * @param {string} course - "cpp" or "python"
 * @param {string} gameTitle - shown in the header
 * @param {Function} onLevelStart - called with (lessonOrder:number, lessonTitle:string)
 */
export async function initLevelSelect(course, gameTitle, progressKey, onLevelStart) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return location.href = "/auth";

      // Get user progress
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const userData = userSnap.data() || {};
      const completedIds = userData.progress?.[course]?.lessonsCompleted || [];
const completedLevels =
    userData.progress?.[course]?.[progressKey] || [];
      // Get lessons ordered
      const snap = await getDocs(
        query(collection(db, "courses", course, "lessons"), orderBy("order"))
      );

      const lessons = [];
      snap.forEach(d => lessons.push({ id: d.id, ...d.data() }));

      if (!lessons.length) {
        document.getElementById("levelSelectScreen").innerHTML = `
          <p class="text-center text-gray-500 mt-10">No lessons found for this course yet.</p>
        `;
        document.getElementById("levelSelectScreen").classList.remove("hidden");
        return;
      }

      // Build level cards
      const grid = document.getElementById("levelGrid");
      grid.innerHTML = "";

      lessons.forEach((lesson, index) => {
        const lessonOrder   = lesson.order ?? (index + 1);
        const isUnlocked    = completedIds.includes(lesson.id);
        const isFirst       = index === 0;
        // First lesson: unlocked if any progress OR if they've started
        // Actually: a level is playable only if that lesson is completed
        // (they must finish the lesson before playing its game level)
        const canPlay = completedIds.includes(lesson.id);
const isCompleted = completedLevels.includes(lessonOrder);
        const card = document.createElement("div");
        card.className = `
          rounded-2xl p-5 text-center shadow transition
          ${canPlay
            ? "bg-softCream cursor-pointer hover:scale-105 hover:shadow-lg"
            : "bg-gray-200 cursor-not-allowed opacity-60"}
        `;
card.innerHTML = `
  <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-bold
    ${canPlay ? "bg-warmOrange text-white" : "bg-gray-400 text-white"}">

    ${
      canPlay
        ? lessonOrder
        : '<i class="fa-solid fa-lock text-sm"></i>'
    }

  </div>

  <p class="font-bold text-deepChocolate text-sm leading-tight">
    ${lesson.title}
  </p>

  ${
    isCompleted
      ? `
      <p class="text-green-600 font-semibold mt-2">
        <i class="fa-solid fa-circle-check"></i>
        Completed
      </p>
      `
      : `
      <p class="text-xs mt-2 ${canPlay ? "text-warmOrange font-semibold" : "text-gray-400"}">
        ${canPlay ? "Play Level " + lessonOrder : "Complete lesson first"}
      </p>
      `
  }
`;
        if (canPlay) {
          card.addEventListener("click", () => {
            document.getElementById("levelSelectScreen").classList.add("hidden");
            onLevelStart(lessonOrder, lesson.title);
          });
        }

        grid.appendChild(card);
      });

      document.getElementById("levelSelectScreen").classList.remove("hidden");
      resolve({ user, userData, lessons, completedIds });
    });
  });
}
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const list     = document.getElementById("leaderboardList");
const tabCpp    = document.getElementById("tabCpp");
const tabPython = document.getElementById("tabPython");

const MEDALS = ["🥇", "🥈", "🥉"];

let allUsers     = [];
let currentUser  = null;
let activeCourse = "cpp";

const ACTIVE_CLS   = "px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition";
const INACTIVE_CLS = "px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition";

function render(course) {
  const sorted = [...allUsers].sort(
    (a, b) => (b.xp?.[course] || 0) - (a.xp?.[course] || 0)
  );

  if (!sorted.length) {
    list.innerHTML = `<p class="text-center text-gray-400">No data yet.</p>`;
    return;
  }

  list.innerHTML = sorted.map((u, i) => {
    const xp       = u.xp?.[course] || 0;
    const isMe     = currentUser && u.uid === currentUser.uid;
    const medal    = MEDALS[i] || `#${i + 1}`;
    const highlight = isMe ? "bg-yellow-50 border border-yellow-300 rounded-lg" : "";

    return `
      <div class="flex items-center justify-between px-4 py-3 ${highlight}">
        <div class="flex items-center gap-3">
          <span class="text-xl w-8 text-center">${medal}</span>
          <span class="font-semibold text-deepChocolate">${u.name || "Unknown"}${isMe ? " <span class='text-xs text-gray-400'>(you)</span>" : ""}</span>
        </div>
        <span class="font-bold text-warmOrange">${xp} XP</span>
      </div>
    `;
  }).join("");
}

function setTab(course) {
  activeCourse       = course;
  tabCpp.className    = course === "cpp"    ? ACTIVE_CLS : INACTIVE_CLS;
  tabPython.className = course === "python" ? ACTIVE_CLS : INACTIVE_CLS;
  render(course);
}

tabCpp.onclick    = () => setTab("cpp");
tabPython.onclick = () => setTab("python");

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  const snap = await getDocs(collection(db, "users"));
  allUsers = [];

  snap.forEach(d => {
    allUsers.push({ uid: d.id, ...d.data() });
  });

  // If user is logged in, show only their enrolled courses in tabs
  if (user) {
    const userSnap = await import("firebase/firestore").then(({ doc, getDoc }) =>
      getDoc(doc(db, "users", user.uid))
    );
    const selected = userSnap.data()?.selectedCourses || ["cpp", "python"];

    tabCpp.style.display    = selected.includes("cpp")    ? "" : "none";
    tabPython.style.display = selected.includes("python") ? "" : "none";

    // Default to first selected course
    setTab(selected[0] || "cpp");
  } else {
    setTab("cpp");
  }
});
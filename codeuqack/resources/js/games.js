// resources/js/games.js
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
    const tabCpp      = document.getElementById("tabCpp");
    const tabPython   = document.getElementById("tabPython");
    const cppGames    = document.getElementById("cppGames");
    const pythonGames = document.getElementById("pythonGames");
    const logoutBtn   = document.getElementById("logoutBtn");

    const ACTIVE   = "tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition";
    const INACTIVE = "tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition";

    tabCpp.addEventListener("click", () => {
        tabCpp.className    = ACTIVE;
        tabPython.className = INACTIVE;
        cppGames.classList.remove("hidden");
        pythonGames.classList.add("hidden");
    });

    tabPython.addEventListener("click", () => {
        tabPython.className = ACTIVE;
        tabCpp.className    = INACTIVE;
        pythonGames.classList.remove("hidden");
        cppGames.classList.add("hidden");
    });

    onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) return;

            const raw = snap.data().selectedCourses || [];
            const courses = raw.map(c => String(c).toLowerCase().trim());

            const hasCpp = courses.includes("cpp");
            const hasPython = courses.includes("python");

            if (hasCpp && hasPython) {
                // both selected -> leave tabs + default behavior as-is
                return;
            }

            if (hasCpp && !hasPython) {
                // only C++ selected -> show only the C++ button
                tabPython.style.display = "none";
                tabCpp.style.display = "";
                cppGames.classList.remove("hidden");
                pythonGames.classList.add("hidden");
            } else if (hasPython && !hasCpp) {
                // only Python selected -> show only the Python button
                tabCpp.style.display = "none";
                tabPython.style.display = "";
                pythonGames.classList.remove("hidden");
                cppGames.classList.add("hidden");
            } else {
                console.warn("No course match found for user. Raw value:", raw);
            }
        } catch (err) {
            console.error("Failed to load user courses:", err);
        }
    });

    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "/";
    });
});
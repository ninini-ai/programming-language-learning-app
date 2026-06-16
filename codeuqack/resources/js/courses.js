import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const container = document.getElementById("courseList");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const courses = userSnap.data().selectedCourses || [];

  container.innerHTML = "";

  courses.forEach(course => {
    container.innerHTML += `
      <div onclick="goToCourse('${course}')"
        class="p-6 bg-white rounded-xl shadow-md cursor-pointer hover:bg-skyBlue transition text-center flex flex-col items-center">
        
        <img
          src="/images/${course.toLowerCase()}.png"
          alt="${course}"
          class="w-20 h-20 object-contain mb-4"
        />

        <h2 class="text-xl font-bold text-gray-800">
          ${course.toUpperCase()}
        </h2>
      </div>
    `;
  });
});

window.goToCourse = (course) => {
  window.location.href = `/lessons/${course}`;
};
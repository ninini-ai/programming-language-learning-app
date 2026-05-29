import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const container = document.getElementById("courseList");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth";

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const courses = userSnap.data().selectedCourses;

  container.innerHTML = "";

  courses.forEach(course => {
    container.innerHTML += `
      <div onclick="goToCourse('${course}')"
        class="p-5 bg-softCream rounded-xl cursor-pointer hover:bg-skyBlue">
        <h2 class="text-xl font-bold">${course.toUpperCase()}</h2>
      </div>
    `;
  });
});

window.goToCourse = (course) => {
  window.location.href = `/lessons/${course}`;
};
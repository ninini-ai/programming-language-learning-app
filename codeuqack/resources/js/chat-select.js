import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const courseList = document.getElementById("courseList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/auth";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

if (!snap.exists()) {
  courseList.innerHTML = `
    <p class="text-red-500 font-bold">
      Profile missing! Please signup again.
    </p>`;
  return;
}


  const courses = snap.data().selectedCourses || [];

  courseList.innerHTML = "";

  courses.forEach(course => {
    const btn = document.createElement("button");
    btn.textContent = `${course.toUpperCase()} Chat Room`;
    btn.className =
      "w-full bg-warmOrange text-white p-3 rounded hover:bg-skyBlue";

    btn.onclick = () => {
      window.location.href = `/chat?room=${course}`;
    };

    courseList.appendChild(btn);
  });
});

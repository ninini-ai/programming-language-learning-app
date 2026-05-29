import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const certArea = document.getElementById("certificateArea");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    certArea.innerHTML = "Please login.";
    return;
  }

  try {

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      certArea.innerHTML = "User profile not found.";
      return;
    }

    const data = snap.data();
    const name = encodeURIComponent(data.name);
    const courses = data.selectedCourses || [];

    certArea.innerHTML = "";

    if (courses.length === 0) {
      certArea.innerHTML = "No courses registered.";
      return;
    }

    courses.forEach(course => {

      let label =
        course === "cpp"
          ? "C++ Certificate"
          : "Python Certificate";

      const btn = document.createElement("a");

      btn.href = `/certificate/${course}?name=${name}`;
      btn.textContent = `Download ${label}`;

      btn.className =
        "bg-warmOrange text-white px-6 py-3 rounded-lg hover:bg-skyBlue inline-block";

      certArea.appendChild(btn);

    });

  } catch (err) {
    console.error(err);
    certArea.innerHTML = "Error loading certificates.";
  }

});

//auth.js
import { auth, db } from "./firebase";
import { updateDailyLoginStreak } from "./gamification";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const emailSignBtn = document.getElementById("emailSignBtn");
const emailSignupBtn = document.getElementById("emailSignupBtn");
const switchMode = document.getElementById("switchMode");
const nameField = document.getElementById("nameField");
const coursesField = document.getElementById("coursesField");
const forgotSection = document.getElementById("forgotSection");
const forgotBtn = document.getElementById("forgotBtn");
const form = document.getElementById("authForm");
const loading = document.getElementById("loadingOverlay");

let mode = "signin";

function animateSwitch(callback) {  
  form.classList.add("fade-out");
  setTimeout(() => {
    callback();
    form.classList.remove("fade-out");
  }, 300);
}

function showLoading() {
  loading.style.display = "flex";
  setTimeout(() => {
    if (loading.style.display === "flex") {
      loading.textContent = "Still connecting… check internet";
    }
  }, 5000);
}

function hideLoading() {
  loading.style.display = "none";
  loading.textContent = "Connecting… please wait";
}

//toggle mode

switchMode.onclick = () => {
  animateSwitch(() => {
    mode = mode === "signin" ? "signup" : "signin";

    nameField.classList.toggle("hidden", mode === "signin"); //hide namfield in signin
    coursesField.classList.toggle("hidden", mode === "signin"); //
    emailSignBtn.classList.toggle("hidden", mode === "signup");
    emailSignupBtn.classList.toggle("hidden", mode === "signin");
    forgotSection.classList.toggle("hidden", mode === "signup"); // hide forgoton signup

    switchMode.textContent =
      mode === "signin"
        ? "Don't have an account? Create one instead"
        : "Already have an account? Sign in";
  });
};

//forgot password here

forgotBtn.onclick = async () => {
  const email = emailInput();
  if (!email) return alert("Enter your email first");
 if (!isValidEmail(email)) return alert("Please use a valid Gmail address");
  try {
    showLoading();
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (err) {
    alert(err.message);
  } finally {
    hideLoading();
  }
};
//signup 

emailSignupBtn.onclick = async () => {
  const email = emailInput();
  const password = passwordInput();
  const name = document.getElementById("name").value.trim();
  const courses = Array.from(document.querySelectorAll(".course-option:checked")).map(c => c.value);

  if (!email || !password || !name) return alert("Fill all fields");
    if (!isValidEmail(email)) return alert("Please use a valid email");
  if (!courses.length) return alert("Select a course");
  if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
    return alert("Password must be at least 8 characters and include a special character (!@#$%^&*)");
  }

  try {
    showLoading();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
  name,
  email,
  selectedCourses: courses,
  createdAt: serverTimestamp(),

  xp:{
  cpp:0,
  python:0
},

level:{
  cpp:1,
  python:1
},
  badges: [],

  streak: {
    count: 0,
    lastActive: null
  },

progress: {
    cpp: {
      lessonsCompleted: [],
      quizzesCompleted: [],
      games: { bucketGame: [], bugHunter: [], codeMaze: [], codeSorter: [] }
    },
    python: {
      lessonsCompleted: [],
      quizzesCompleted: [],
      games: { bucketGame: [], bugHunter: [], codeMaze: [], codeSorter: [] }
    }
}
});
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.message);
  } finally {
    hideLoading();
  }
};

//signin 

emailSignBtn.onclick = async () => {
  const email = emailInput();
  const password = passwordInput();
  if (!email || !password)
    return alert("Fill all fields");
  if (!isValidEmail(email))
    return alert("Please enter a valid email address");
  try {
    showLoading();
    // Firebase login
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateDailyLoginStreak();
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.message);
  } finally {
    hideLoading();
  }
};
//helpers

function emailInput() {
  return document.getElementById("email").value.trim();
}

function passwordInput() {
  return document.getElementById("password").value.trim();
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.(com|org|net|edu|edu\.pk|pk|co|io)$/.test(email);
}
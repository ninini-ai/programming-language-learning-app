<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<title>Profile</title>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
 @vite(['resources/css/app.css']) 
</head>
<body class=" min-h-screen flex flex-col p-6">
      
 <nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
  <div class="container mx-auto flex items-center px-4 py-2">
    <img 
      src="{{ asset('/images/mascotCodeQuackapp.png') }}" 
      alt="CodeQuack Logo" 
      class="w-12 h-auto mr-2"
    >
    <span class="text-2xl font-extrabold text-deepChocolate">
      CodeQuack
    </span>
    <button id="logoutBtn" class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
{{-- <a href="/chat"
   class="bg-warmOrange text-white px-4 py-2 rounded-lg">
   Community Chat
</a> --}}
  </div>
</nav>
<main class="flex flex-col items-center w-full mt-20 pb-24">
 <div class="container mx-auto mt-10 max-w-3xl bg-white rounded-lg shadow relative pt-14 pb-6 ">
  <div class="absolute left-1/2 -top-12 transform -translate-x-1/2">
    <img
      src="{{ asset('images/userIcon.jpg') }}"
      alt="profileimage"
      class="w-24 h-24 rounded-full border-4 border-white object-cover shadow bg-mintGreen"
    >
  </div>
  <div class="flex flex-col items-center text-center">
    <h2 class="text-2xl font-bold text-deepChocolate mt-4">
      Welcome, <span id="userName">Loading...</span>
    </h2>
  </div>
</div>
<!-- *******************************************************8 -->
<!-- Courses -->
<div class="container mx-auto mt-6 max-w-3xl bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold text-deepChocolate mb-4 text-center">
    Your Courses
  </h2>
  <div id="userCourses" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Cpp COURSE -->
    <div
      onclick="selectCourse(this, 'cpp')"
      class="course-card cursor-pointer border-2 border-transparent rounded-xl p-4 bg-softCream hover:border-skyBlue transition">
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-code text-3xl text-warmOrange"></i>a
        <div>
          <h3 class="font-bold text-lg text-deepChocolate">C++ for Beginners</h3>
          <p class="text-sm text-gray-600">12 Lessons • Basics to OOP</p>
        </div>
      </div>
    </div>

    <!-- python course-->
    <div
      onclick="selectCourse(this, 'python')"
      class="course-card cursor-pointer border-2 border-transparent rounded-xl p-4 bg-softCream hover:border-skyBlue transition">
      <div class="flex items-center gap-3">
        <i class="fa-brands fa-python text-3xl text-warmOrange"></i>
        <div>
          <h3 class="font-bold text-lg text-deepChocolate">Python for Beginners</h3>
          <p class="text-sm text-gray-600">10 Lessons • Logic & Scripting</p>
        </div>
      </div>
    </div>

  </div>

  <div class="text-center mt-5">
    <button id="accessCourseBtn"
      class="bg-warmOrange hover:bg-skyBlue text-white px-6 py-2 rounded-lg hidden">
      Access Selected Course
    </button>
  </div>
</div>
<!-- *******************************************************8 -->
<!--streaks-->
<div class="container mx-auto mt-6 max-w-3xl bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold text-deepChocolate mb-4 text-center">
   Learning Streak
  </h2>
  <div class="flex justify-between items-center text-center">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-mintGreen flex items-center justify-center">
        <i class="fa-solid fa-check text-white"></i>
      </div>
      <span class="text-xs mt-1">Mon</span>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-mintGreen flex items-center justify-center">
        <i class="fa-solid fa-check text-white"></i>
      </div>
      <span class="text-xs mt-1">Tue</span>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-mintGreen flex items-center justify-center">
        <i class="fa-solid fa-check text-white"></i>
      </div>
      <span class="text-xs mt-1">Wed</span>
    </div>
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-warmOrange flex items-center justify-center">
        <i class="fa-solid fa-fire text-white"></i>
      </div>
      <span class="text-xs mt-1">Today</span>
    </div>

    <div class="flex flex-col items-center opacity-40">
      <div class="w-10 h-10 rounded-full bg-gray-300"></div>
      <span class="text-xs mt-1">Fri</span>
    </div>

    <div class="flex flex-col items-center opacity-40">
      <div class="w-10 h-10 rounded-full bg-gray-300"></div>
      <span class="text-xs mt-1">Sat</span>
    </div>

    <div class="flex flex-col items-center opacity-40">
      <div class="w-10 h-10 rounded-full bg-gray-300"></div>
      <span class="text-xs mt-1">Sun</span>
    </div>

  </div>

  <p id="streakText" class="text-center text-sm text-gray-600 mt-4">
    4-day active learning streak
  </p>
</div>
<!-- *******************************************************8 -->

<div class="grid md:grid-cols-2 gap-6 justify-center mt-5 mb-8 max-w-5xl mx-auto px-4">
  <div class="flex bg-softCream rounded-lg shadow p-6 items-center">
    <i class="fa-solid fa-star text-4xl text-warmOrange mr-4"></i>
    <div>
      <h3 class="font-bold text-xl text-deepChocolate">XP Points</h3>
      <p class="text-gray-600">0 points earned</p>
    </div>
  </div>

  <div class="flex bg-softCream rounded-lg shadow p-6 items-center">
    <i class="fa-solid fa-award text-4xl text-warmOrange mr-4"></i>
    <div>
      <h3 class="font-bold text-xl text-deepChocolate">Achievements</h3>
     <p id="badgeCountText" class="text-gray-600">0 badges earned</p>
    </div>
  </div>

  <div class="flex bg-softCream rounded-lg shadow p-6 items-center">
    <i class="fa-solid fa-code text-4xl text-warmOrange mr-4"></i>
    <div>
      <h3 class="font-bold text-xl text-deepChocolate">Completed Lessons</h3>
      <p class="text-gray-600">0 lessons completed</p>
    </div>
  </div>

 <div class="flex bg-softCream rounded-lg shadow p-6 items-center">
  <i class="fa-solid fa-certificate text-4xl text-warmOrange mr-4"></i>

  <div class="w-full">
    <h3 class="font-bold text-xl text-deepChocolate">Certification</h3>
    <!-- Certificate buttons -->
    <div id="certificateArea" class="flex flex-col gap-2"></div>
  </div>
</div>
</div> 

<div class="container mx-auto mt-6 max-w-3xl bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold text-deepChocolate mb-4 text-center">
    Your Badges
  </h2>

  <div id="badgeContainer" class="flex flex-wrap gap-4 justify-center">
    <p class="text-gray-500">No badges yet</p>
  </div>
</div>
 



</main>
    <div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-inner py-3">
  <div class="flex justify-center items-center gap-x-20  text-deepChocolate text-sm">

<a href="{{ url('/courses') }}" class="flex flex-col items-center hover:text-skyBlue transition">
  <i class="fa-solid fa-book text-xl"></i>
  <span class="hidden lg:inline mt-1 text-xl">Courses</span>
</a>
    <a href="{{ url('/leaderboard') }}"
   class="flex flex-col items-center hover:text-skyBlue transition">
  <i class="fa-solid fa-trophy text-xl"></i>
  <span class="hidden lg:inline mt-1 text-xl">Leaderboard</span>
</a>

    <a href="/chat-select" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-message text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Chat Rooms</span>
    </a>

    <a href="{{ asset('games') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-gamepad text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Games</span>
    </a>

    <a href="{{ asset('dashboard') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-user text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Profile</span>
    </a>
 <a href="{{ asset('feedback') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-comment-dots text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Feedback</span>
    </a>
  </div>
</div>

<script type="module">
import { auth, db } from "/resources/js/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/* FORMAT BADGE NAME */
function formatBadgeName(badge) {
  return badge
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

/* LOAD DASHBOARD DATA */
async function loadDashboardData(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  // --------------------
  // ⭐ XP
  // --------------------
  document.querySelector(".fa-star")
    .parentElement.querySelector("p").textContent =
    (data.xp || 0) + " points earned";

  // --------------------
  // 🏆 BADGE COUNT
  // --------------------
  document.getElementById("badgeCountText").textContent =
    (data.badges?.length || 0) + " badges earned";

  // --------------------
  // 📚 LESSONS COMPLETED
  // --------------------
  let totalLessons = 0;

  (data.selectedCourses || []).forEach(course => {
    totalLessons += data.progress?.[course]?.lessonsCompleted?.length || 0;
  });

  document.querySelector(".fa-code")
    .parentElement.querySelector("p").textContent =
    totalLessons + " lessons completed";

  // --------------------
  // 🔥 STREAK TEXT
  // --------------------
  document.getElementById("streakText").textContent =
    (data.streak?.count || 0) + "-day active learning streak";

  // --------------------
  // 🔥 STREAK UI (DAYS)
  // --------------------
  updateStreakUI(data.streak);

  // --------------------
  // 🏆 BADGE DISPLAY
  // --------------------
  const badgeContainer = document.getElementById("badgeContainer");
  badgeContainer.innerHTML = "";

  if (!data.badges || data.badges.length === 0) {
    badgeContainer.innerHTML = "<p class='text-gray-500'>No badges yet</p>";
  } else {
    data.badges.forEach(badge => {
      badgeContainer.innerHTML += `
        <div class="flex flex-col items-center bg-softCream p-3 rounded-lg shadow w-20 hover:scale-110 transition">
          <img src="/images/badges/${badge}.png"
            class="w-10 h-10 object-contain mb-1">
          <span class="text-xs text-center">${formatBadgeName(badge)}</span>
        </div>
      `;
    });
  }
}

/* 🔥 STREAK VISUAL LOGIC */
function updateStreakUI(streak) {
  const days = document.querySelectorAll(".flex.justify-between > div");

  const count = streak?.count || 0;

  days.forEach((day, index) => {
    const circle = day.querySelector("div");

    if (index < count) {
      circle.className =
        "w-10 h-10 rounded-full bg-mintGreen flex items-center justify-center";
      circle.innerHTML = `<i class="fa-solid fa-check text-white"></i>`;
    } else if (index === count) {
      circle.className =
        "w-10 h-10 rounded-full bg-warmOrange flex items-center justify-center";
      circle.innerHTML = `<i class="fa-solid fa-fire text-white"></i>`;
    } else {
      circle.className =
        "w-10 h-10 rounded-full bg-gray-300";
      circle.innerHTML = "";
    }
  });
}

/* AUTH CHECK */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/auth";
  } else {
    document.getElementById("userName").textContent =
      user.displayName || user.email;

    await loadDashboardData(user);
  }
});

/* LOGOUT */
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  window.location.href = "/auth";
};
</script>

@vite(['resources/js/dashboard.js'])
</body>
</html>

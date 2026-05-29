<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>

  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">

  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen p-6 pb-24">

<!-- HEADER -->
<div class="text-center mb-6">
  <h1 class="text-3xl font-bold text-deepChocolate">Dashboard</h1>
  <div class="text-center mb-4">
  <h2 class="text-xl font-semibold text-deepChocolate">
    Welcome, <span id="userName">...</span>
  </h2>
</div>
  <p class="text-gray-600">Track your learning progress</p>
</div>

<div class="max-w-4xl mx-auto space-y-6">

  <!-- XP + LEVEL -->
  <div class="bg-white p-5 rounded-lg shadow flex justify-between">
    <div>
      <h2 class="text-lg font-semibold">XP</h2>
      <p id="xp" class="text-2xl font-bold text-warmOrange">0</p>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Level</h2>
      <p id="level" class="text-2xl font-bold text-deepChocolate">1</p>
    </div>
  </div>

  <!-- STREAK -->
  <div class="bg-white p-5 rounded-lg shadow">
    <h2 class="font-semibold mb-2"> Daily Streak</h2>
    <p id="streak" class="text-xl font-bold">0 days</p>
  </div>

  <!-- PROGRESS -->
  <div class="bg-white p-5 rounded-lg shadow">
    <h2 class="font-semibold mb-3"> Course Progress</h2>
    <div id="progressArea"></div>
  </div>

  <!-- BADGES -->
  <div class="bg-white p-5 rounded-lg shadow">
    <h2 class="font-semibold mb-3"> Badges</h2>
    <div id="badgesArea" class="flex flex-wrap gap-2"></div>
  </div>

  <!-- HISTORY -->
  <div class="bg-white p-5 rounded-lg shadow">
    <h2 class="font-semibold mb-3"> Learning History</h2>
    <div id="historyArea" class="text-gray-600"></div>
  </div>

  <!-- CERTIFICATION -->
  <div class="flex bg-softCream rounded-lg shadow p-6 items-center">
  <i class="fa-solid fa-certificate text-4xl text-warmOrange mr-4"></i>

  <div class="w-full">
    <h3 class="font-bold text-xl text-deepChocolate">Certification</h3>
    <div id="certificateArea" class="flex flex-col gap-2"></div>
  </div>
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


@vite(['resources/js/dashboard.js'])

</body>
</html>
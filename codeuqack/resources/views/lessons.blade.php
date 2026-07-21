<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lessons</title>
  <link rel="icon" type="image/png" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-sunnyYellow min-h-screen pb-24">

<!-- TOP NAV -->
<nav class="bg-white/70 shadow">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">CodeQuack</span>
        <a href="{{ url('/courses') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition text-sm">
            <i class="fa-solid fa-arrow-left"></i> Back
        </a>
    </div>
</nav>

<main class="max-w-2xl mx-auto px-4 pt-8">
    <h1 class="text-2xl font-bold text-center mb-6 text-deepChocolate" id="courseTitle"></h1>
    <div id="lessonList" class="space-y-3"></div>
</main>

<!-- BOTTOM NAV -->
<div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-inner py-3">
    <div class="flex justify-center items-center gap-x-16 text-deepChocolate text-sm">
        <a href="{{ url('/courses') }}" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-book text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Courses</span>
        </a>
        <a href="{{ url('/leaderboard') }}" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-trophy text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Leaderboard</span>
        </a>
        <a href="/chat-select" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-message text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Chat Rooms</span>
        </a>
        <a href="{{ url('/games') }}" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-gamepad text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Games</span>
        </a>
        <a href="{{ url('/dashboard') }}" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-user text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Profile</span>
        </a>
        <a href="{{ url('/feedback') }}" class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-comment-dots text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Feedback</span>
        </a>
    </div>
</div>

@vite(['resources/js/lessons.js'])
</body>
</html>
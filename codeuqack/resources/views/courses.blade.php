
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Courses</title>
 <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen p-6">

<!-- HEADER -->
<div class="text-center mb-8">
  <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-20 mx-auto mb-2">
  <h1 class="text-3xl font-extrabold text-deepChocolate">Your Courses</h1>
  <p class="text-gray-600">Pick a course and start learning 🚀</p>
</div>

<!-- COURSE LIST -->
<div id="courseList" class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">


  <div class="bg-white rounded-xl shadow p-6 text-center animate-pulse col-span-full">
    <p class="text-gray-500">Loading your courses...</p>
  </div>

</div>
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
@vite(['resources/js/courses.js'])

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])
</head>
<body class="bg-sunnyYellow min-h-screen pb-24">

<div class="max-w-5xl mx-auto px-4 py-8">

    <!-- MASCOT + WELCOME -->
    <div class="flex flex-col items-center text-center mb-6">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-20 h-20 object-contain mb-3">
        <h1 class="text-3xl font-bold text-deepChocolate">
            Welcome, <span id="userName">...</span>!
        </h1>
    </div>

    <!-- COURSE TABS -->
    <div id="courseTabs" class="flex justify-center gap-3 mb-8 hidden">
    </div>

    <!-- PER-COURSE PANEL -->
    <div id="coursePanel">
        <p class="text-center text-gray-500">Loading your dashboard…</p>
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

<script>
  window.APP_IMAGES = {
    streak:      "{{ asset('images/streak.png') }}",
    xp:          "{{ asset('images/xp.png') }}",
    percent:     "{{ asset('images/percent.png') }}",
    history:     "{{ asset('images/history.png') }}",
    certificate: "{{ asset('images/certificate.png') }}",
    bronze:      "{{ asset('images/bronze.png') }}",
    silver:      "{{ asset('images/silver.png') }}",
    gold:        "{{ asset('images/gold.png') }}",
    platinum:    "{{ asset('images/platinum.png') }}",
  };
</script>

@vite(['resources/js/dashboard.js'])
</body>
</html>
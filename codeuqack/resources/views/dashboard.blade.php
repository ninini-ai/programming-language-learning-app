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

<div class="max-w-6xl mx-auto px-6 py-8">

    <!-- MASCOT -->
    <div class="flex justify-center mb-3">
        <!-- Replace with your image later -->
        <img
            src="{{ asset('images/mascotCodeQuackapp.png') }}"
            alt="Mascot"
            class="w-20 h-20 object-contain"
        >
    </div>

    <!-- WELCOME -->
    <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-deepChocolate">
            Welcome,
            <span id="userName">Username</span>.
        </h1>
    </div>

    <!-- TOP CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <!-- STREAK -->
    <div class="bg-softCream rounded-xl p-4 shadow-md">
    <div class="flex flex-col items-center text-center">
        <img
            src="{{ asset('images/streak.png') }}"
            class="w-12 h-12 object-contain mb-2"
            alt="Streak"
        >

        <p id="streak" class="text-2xl font-bold text-deepChocolate">
            0 days
        </p>

        <p class="font-semibold text-deepChocolate">
            Streak
        </p>
    </div>
</div>

        <!-- XP -->
        <div class="bg-softCream rounded-3xl p-5 flex flex-col items-center text-center shadow-md">

    <img
        src="{{ asset('images/xp.png') }}"
        class="w-12 h-12 object-contain mb-2"
        alt="XP"
    >

    <div>
        <p id="xp" class="text-2xl font-bold text-deepChocolate">
            0
        </p>
        <p class="font-semibold text-deepChocolate">
            Total XP
        </p>
    </div>

</div>

        <!-- BADGES -->
        <div class="bg-softCream rounded-3xl p-5 flex flex-col items-center text-center shadow-md">

    <img
        src="{{ asset('images/bronze.png') }}"
        class="w-12 h-12 object-contain mb-2"
        alt="Badge"
    >

    <div>
        <p class="text-2xl font-bold text-deepChocolate">
            Badge
        </p>

        <div id="badgesArea" class="text-deepChocolate font-semibold">
        </div>
    </div>

</div>
        <!-- COURSE PROGRESS -->
       <div class="bg-softCream rounded-3xl p-5 flex flex-col items-center text-center shadow-md">

    <img
        src="{{ asset('images/percent.png') }}"
        class="w-12 h-12 object-contain mb-2"
        alt="Progress"
    >

    <div class="w-full">
        <div id="progressArea"></div>
    </div>

</div>

    </div>

    <!-- BOTTOM SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- HISTORY -->
        <div class="bg-softCream rounded-[30px] p-8 shadow-md min-h-[250px]">

            <div class="flex flex-col items-center">

                <!-- Replace image later -->
                <img
                    src="{{ asset('images/history.png') }}"
                    class="w-16 h-16 mb-4 object-contain"
                    alt="History"
                >

                <h2 class="text-4xl font-bold text-deepChocolate mb-6">
                    Learning History
                </h2>

                <div
                    id="historyArea"
                    class="text-center text-xl text-deepChocolate font-semibold"
                >
                </div>
            </div>
        </div>

        <!-- CERTIFICATION -->
        <div class="bg-softCream rounded-[30px] p-8 shadow-md min-h-[250px]">

            <div class="flex flex-col items-center">

                <!-- Replace image later -->
                <img
                    src="{{ asset('images/certificate.png') }}"
                    class="w-16 h-16 mb-4 object-contain"
                    alt="Certificate"
                >

                <h2 class="text-4xl font-bold text-deepChocolate mb-6">
                    Certification
                </h2>

                <div
                    id="certificateArea"
                    class="flex flex-col gap-3 w-full max-w-sm"
                >
                </div>
            </div>
        </div>

    </div>

</div>

<!-- HIDDEN LEVEL (JS STILL USES IT) -->
<div class="hidden">
    <span id="level">1</span>
</div>

<!-- BOTTOM NAV -->
<div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-inner py-3">

    <div class="flex justify-center items-center gap-x-20 text-deepChocolate text-sm">

        <a href="{{ url('/courses') }}"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-book text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Courses</span>
        </a>

        <a href="{{ url('/leaderboard') }}"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-trophy text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Leaderboard</span>
        </a>

        <a href="/chat-select"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-message text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Chat Rooms</span>
        </a>

        <a href="{{ asset('games') }}"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-gamepad text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Games</span>
        </a>

        <a href="{{ asset('dashboard') }}"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-user text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Profile</span>
        </a>

        <a href="{{ asset('feedback') }}"
           class="flex flex-col items-center hover:text-skyBlue transition">
            <i class="fa-solid fa-comment-dots text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Feedback</span>
        </a>

    </div>

</div>
@vite(['resources/js/dashboard.js'])

</body>
</html>
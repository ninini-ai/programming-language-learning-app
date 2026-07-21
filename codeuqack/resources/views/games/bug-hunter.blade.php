<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bug Hunter – {{ strtoupper($course) }}</title>
    <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])
</head>
<body class="bg-sunnyYellow min-h-screen pb-10">

<nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">
            Bug Hunter – <span class="text-warmOrange">{{ strtoupper($course) }}</span>
        </span>
        <a href="{{ url('/games') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition">
            <i class="fa-solid fa-arrow-left"></i> Back
        </a>
    </div>
</nav>

<main class="max-w-2xl mx-auto px-4 pt-24">

    <!-- LEVEL SELECT -->
    <div id="levelSelectScreen" class="hidden">
        <h2 class="text-2xl font-bold text-deepChocolate text-center mb-2">
            🐛 Bug Hunter
        </h2>
        <p class="text-center text-gray-500 text-sm mb-6">
            Complete a lesson to unlock its game level
        </p>
        <div id="levelGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
    </div>

    <!-- GAME SCREEN -->
    <div id="gameScreen" class="hidden">

        <div class="flex justify-between items-center mb-4">
            <button id="backToLevels"
                class="text-sm text-warmOrange font-semibold hover:underline">
                <i class="fa-solid fa-arrow-left"></i> Levels
            </button>
            <div class="bg-softCream rounded-xl px-4 py-2 shadow text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-star text-warmOrange"></i>
                <span id="levelTitle">Level 1</span>
            </div>
            <div class="bg-softCream rounded-xl px-4 py-2 shadow text-sm font-semibold text-deepChocolate">
                Bug <span id="qNum">1</span>/<span id="qTotal">1</span>
            </div>
        </div>

        <div class="bg-softCream rounded-2xl p-6 shadow-md mb-4">
            <p class="text-sm text-gray-400 mb-2 font-semibold uppercase tracking-wide">
                Find the bug:
            </p>
            <pre id="codeBlock"
                 class="bg-gray-900 text-green-400 rounded-xl p-4 text-sm overflow-x-auto mb-5 leading-relaxed"></pre>
            <p class="font-semibold text-deepChocolate mb-3">What is wrong?</p>
            <div id="optionsArea" class="space-y-2"></div>
            <div id="feedback" class="hidden mt-4 p-4 rounded-xl text-center font-semibold"></div>
            <div id="hintBox" class="hidden mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                <i class="fa-solid fa-lightbulb"></i> <span id="hintText"></span>
            </div>
        </div>

        <div class="flex gap-3">
            <button id="hintBtn"
                class="flex-1 py-2 bg-white border-2 border-warmOrange text-warmOrange rounded-lg font-semibold hover:bg-warmOrange hover:text-white transition">
                <i class="fa-solid fa-lightbulb"></i> Hint
            </button>
            <button id="nextBtn"
                class="hidden flex-1 py-2 bg-warmOrange text-white rounded-lg font-semibold hover:bg-skyBlue transition">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        <div class="mt-4 flex justify-between items-center bg-softCream rounded-xl px-4 py-2 shadow">
            <span class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-bolt text-warmOrange"></i> Session XP
            </span>
            <span id="xpDisplay" class="font-bold text-warmOrange">0</span>
        </div>
    </div>

    <!-- WIN SCREEN -->
    <div id="winScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md">
        <div class="text-6xl mb-3">🏆</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Level Complete!</h2>
        <p class="text-gray-500 mb-1">Great bug hunting!</p>
        <p class="text-xl font-bold text-warmOrange mb-6">
            +<span id="finalXP">0</span> XP Earned
        </p>
        <div class="flex gap-3 justify-center">
            <button onclick="backToLevelSelect()"
                class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
                Play Another Level
            </button>
            <a href="{{ url('/games') }}"
               class="px-6 py-2 bg-white border-2 border-warmOrange text-warmOrange rounded-lg hover:bg-warmOrange hover:text-white transition font-semibold">
                Back to Games
            </a>
        </div>
    </div>

</main>

<script>window.COURSE = "{{ $course }}";</script>
@vite(['resources/js/games/bug-hunter.js'])
</body>
</html>
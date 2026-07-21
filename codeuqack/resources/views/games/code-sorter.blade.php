<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Sorter – {{ strtoupper($course) }}</title>
    <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])

    <style>
        .block {
            cursor: grab;
            user-select: none;
            transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
            touch-action: none;
        }
        .block:active { cursor: grabbing; }
        .block.dragging {
            opacity: 0.45;
            transform: scale(0.97);
        }
        .block.correct-flash {
            border-color: #22c55e !important;
            background: #f0fdf4 !important;
        }
        .block.wrong-flash {
            border-color: #ef4444 !important;
            background: #fef2f2 !important;
        }
        .drop-zone {
            min-height: 56px;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            transition: border-color 0.15s, background 0.15s;
        }
        .drop-zone.drag-over {
            border-color: #f97316;
            background: #fff7ed;
        }
        .number-badge {
            min-width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 13px;
            font-weight: 700;
        }
    </style>
</head>

<body class="bg-sunnyYellow min-h-screen pb-10">

<!-- TOP NAV -->
<nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">
            Code Sorter –
            <span class="text-warmOrange">{{ strtoupper($course) }}</span>
        </span>
        <a href="{{ url('/games') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition text-sm">
            <i class="fa-solid fa-arrow-left"></i> Back
        </a>
    </div>
</nav>

<main class="max-w-lg mx-auto px-4 pt-20 pb-10">
    
<div id="levelSelectScreen" class="hidden">
    <h2 class="text-2xl font-bold text-deepChocolate text-center mb-2">🎮 Code Sorter</h2>
    <p class="text-center text-gray-500 text-sm mb-6">Complete a lesson to unlock its game level</p>
    <div id="levelGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
</div>
    <!-- LOCKED -->
    <div id="lockedScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <i class="fa-solid fa-lock text-6xl text-warmOrange mb-4"></i>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Game Locked</h2>
        <p class="text-gray-500 mb-6">
            Complete <strong>Lesson 1</strong> of
            <strong>{{ strtoupper($course) }}</strong> to unlock Code Sorter.
        </p>
        <a href="{{ url('/lessons/' . $course) }}"
           class="inline-block bg-warmOrange text-white px-6 py-2 rounded-lg hover:bg-skyBlue transition font-semibold">
            Go to Lessons
        </a>
    </div>

    <!-- GAME -->
    <div id="gameScreen" class="hidden mt-4">
 <button id="backToLevels"
                class="text-sm text-warmOrange font-semibold hover:underline">
                <i class="fa-solid fa-arrow-left"></i> Levels
            </button>
            <div class="bg-softCream rounded-xl px-4 py-2 shadow text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-star text-warmOrange"></i>
                <span id="levelTitle">Level 1</span>
            </div>
        <!-- TOP BAR -->
        <div class="flex items-center justify-between bg-softCream rounded-2xl px-5 py-3 shadow mb-4">
            <div class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-star text-warmOrange"></i>
                Level <span id="levelDisplay">1</span>
            </div>
            <div class="bg-warmOrange text-white text-sm font-bold px-4 py-1 rounded-full">
                <span id="qNum">1</span> / <span id="qTotal">1</span>
            </div>
            <div class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-bolt text-warmOrange"></i>
                XP: <span id="xpDisplay">0</span>
            </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-5">
            <div id="progressBar" class="bg-warmOrange h-2 rounded-full transition-all" style="width:0%"></div>
        </div>

        <!-- TASK DESCRIPTION -->
        <div class="bg-softCream rounded-2xl p-4 shadow mb-4">
            <p class="text-xs text-gray-400 uppercase font-semibold mb-1">Task</p>
            <p id="taskText" class="text-base font-bold text-deepChocolate"></p>
        </div>

        <!-- ANSWER ZONE (drop target) -->
        <div class="bg-softCream rounded-2xl p-4 shadow mb-4">
            <p class="text-xs text-gray-400 uppercase font-semibold mb-3">
                Your Order — drag blocks here
            </p>
            <div id="answerZone" class="space-y-2 min-h-[60px]"></div>
        </div>

        <!-- BLOCK POOL (shuffled source) -->
        <div class="bg-white rounded-2xl p-4 shadow mb-4">
            <p class="text-xs text-gray-400 uppercase font-semibold mb-3">
                Code Blocks — drag to arrange
            </p>
            <div id="blockPool" class="space-y-2"></div>
        </div>

        <!-- FEEDBACK -->
        <div id="feedback" class="hidden p-4 rounded-2xl text-center font-semibold mb-4"></div>

        <!-- BUTTONS -->
        <div class="flex gap-3">
            <button id="checkBtn"
                class="flex-1 py-3 bg-warmOrange text-white rounded-xl font-bold hover:bg-skyBlue transition">
                <i class="fa-solid fa-check"></i> Check Order
            </button>
            <button id="nextBtn"
                class="hidden flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

    </div>

    <!-- WIN SCREEN -->
    <div id="winScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <div class="text-6xl mb-3">🏆</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">All Sorted!</h2>
        <p class="text-gray-500 mb-1">You arranged all the code correctly!</p>
        <p class="text-xl font-bold text-warmOrange mb-6">
            +<span id="finalXP">0</span> XP Earned
        </p>
        <div class="flex gap-3 justify-center">
            <button onclick="restartGame()"
                class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
                Play Again
            </button>
            <a href="{{ url('/games') }}"
               class="px-6 py-2 bg-white border-2 border-warmOrange text-warmOrange rounded-lg hover:bg-warmOrange hover:text-white transition font-semibold">
                Back to Games
            </a>
        </div>
    </div>

</main>

<script>
    window.COURSE = "{{ $course }}";
</script>
@vite(['resources/js/games/code-sorter.js'])
</body>
</html>
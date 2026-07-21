<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bucket Game – {{ strtoupper($course) }}</title>
    <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])

    <style>
        .token {
            cursor: grab;
            user-select: none;
            touch-action: none;
            transition: transform 0.15s, opacity 0.15s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .token:active { cursor: grabbing; }
        .token.dragging { opacity: 0.4; transform: scale(0.95); }

        .bucket {
            min-height: 110px;
            border-radius: 16px;
            border: 2.5px dashed #d1d5db;
            transition: border-color 0.15s, background 0.15s;
            display: flex;
            flex-direction: column;
        }
        .bucket.drag-over {
            border-style: solid;
        }

        .bucket-token {
            font-family: monospace;
            font-size: 13px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 20px;
            display: inline-block;
            margin: 3px;
        }

        /* heart */
        .heart { font-size: 20px; }
        .heart.lost { filter: grayscale(1) opacity(0.35); }
    </style>
</head>

<body class="bg-sunnyYellow min-h-screen pb-10">

<!-- NAV -->
<nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">
            Bucket Game –
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
    <h2 class="text-2xl font-bold text-deepChocolate text-center mb-2">🎮 Bucket Game</h2>
    <p class="text-center text-gray-500 text-sm mb-6">Complete a lesson to unlock its game level</p>
    <div id="levelGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
</div>
    <!-- LOCKED -->
    <div id="lockedScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <i class="fa-solid fa-lock text-6xl text-warmOrange mb-4"></i>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Game Locked</h2>
        <p class="text-gray-500 mb-6">
            Complete <strong>Lesson 1</strong> of
            <strong>{{ strtoupper($course) }}</strong> to unlock Bucket Game.
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
        <!-- LIVES + Q COUNTER -->
        <div class="bg-softCream rounded-2xl px-5 py-3 shadow mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="font-semibold text-deepChocolate">Lives:</span>
                <span id="livesDisplay" class="flex gap-1"></span>
            </div>
            <div class="bg-warmOrange text-white text-sm font-bold px-4 py-1 rounded-full">
                Q <span id="qNum">1</span> / <span id="qTotal">1</span>
            </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div id="progressBar" class="bg-warmOrange h-2 rounded-full transition-all" style="width:0%"></div>
        </div>

        <!-- CODE LINE -->
        <div class="bg-gray-900 rounded-2xl px-5 py-4 mb-4 shadow">
            <p class="text-xs text-gray-400 mb-1 font-mono">Code Line:</p>
            <p id="codeLine" class="text-white font-mono text-lg font-bold"></p>
        </div>

        <!-- INSTRUCTION -->
        <p class="text-sm font-bold text-deepChocolate mb-3">
            🎯 Drag tokens into the correct buckets:
        </p>

        <!-- BUCKETS -->
        <div id="bucketsRow" class="grid grid-cols-2 gap-3 mb-4">
            <!-- rendered by JS -->
        </div>

        <!-- TOKENS POOL -->
        <div class="bg-softCream rounded-2xl p-4 shadow mb-4 border-2 border-warmOrange">
            <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-bold text-deepChocolate">🏀 Tokens to Sort</p>
                <p id="placedCount" class="text-sm text-gray-500 font-semibold">0 / 0 placed</p>
            </div>
            <div id="tokenPool" class="flex flex-wrap gap-2 min-h-[44px]"></div>
        </div>

        <!-- FEEDBACK -->
        <div id="feedback" class="hidden p-4 rounded-2xl text-center font-semibold mb-4 text-sm"></div>

        <!-- BUTTONS -->
        <div class="flex gap-3">
            <button id="checkBtn"
                class="flex-1 py-3 bg-warmOrange text-white rounded-xl font-bold hover:bg-skyBlue transition">
                <i class="fa-solid fa-check"></i> Check
            </button>
            <button id="nextBtn"
                class="hidden flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        <!-- XP -->
        <div class="mt-4 flex items-center justify-between bg-softCream rounded-xl px-4 py-2 shadow">
            <span class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-bolt text-warmOrange"></i> Session XP
            </span>
            <span id="xpDisplay" class="font-bold text-warmOrange">0</span>
        </div>

    </div>

    <!-- WIN -->
    <div id="winScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <div class="text-6xl mb-3">🏆</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Buckets Full!</h2>
        <p class="text-gray-500 mb-1">You sorted all the tokens correctly!</p>
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

    <!-- LOSE -->
    <div id="loseScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <div class="text-6xl mb-3">💔</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Out of Lives!</h2>
        <p class="text-gray-500 mb-6">Keep practising — you've got this!</p>
        <button onclick="restartGame()"
            class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
            Try Again
        </button>
    </div>

</main>

<script> window.COURSE = "{{ $course }}"; </script>
@vite(['resources/js/games/bucket-game.js'])
</body>
</html>
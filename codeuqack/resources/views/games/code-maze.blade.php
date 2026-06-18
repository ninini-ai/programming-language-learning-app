<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Maze – {{ strtoupper($course) }}</title>
    <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])

    <style>
        .cell {
            width: 44px;
            height: 44px;
            border: 2px solid #5C3D11;
            background: #FDF3DC;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            transition: background 0.2s;
        }
        .cell.wall   { background: #5C3D11; border-color: #3b2506; }
        .cell.path   { background: #FDF3DC; }
        .cell.player { background: #FDF3DC; }
        .cell.goal   { background: #f59e0b; }
        .cell.visited { background: #fde68a; }

        .option-btn {
            transition: all 0.15s;
        }
        .option-btn:hover {
            transform: translateY(-1px);
        }

        #mazeGrid {
            display: inline-grid;
            gap: 0px;
            border: 3px solid #5C3D11;
            border-radius: 12px;
            overflow: hidden;
        }

        .heart { color: #ef4444; font-size: 20px; }
        .heart.lost { color: #d1d5db; }
    </style>
</head>

<body class="bg-sunnyYellow min-h-screen pb-10">

<!-- TOP NAV -->
<nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">
            Code Maze –
            <span class="text-warmOrange">{{ strtoupper($course) }}</span>
        </span>
        <a href="{{ url('/games') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition">
            <i class="fa-solid fa-arrow-left"></i> Back
        </a>
    </div>
</nav>

<main class="max-w-lg mx-auto px-4 pt-20 pb-10">

    <!-- LOCKED -->
    <div id="lockedScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <i class="fa-solid fa-lock text-6xl text-warmOrange mb-4"></i>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Game Locked</h2>
        <p class="text-gray-500 mb-6">
            Complete <strong>Lesson 1</strong> of
            <strong>{{ strtoupper($course) }}</strong> to unlock Code Maze.
        </p>
        <a href="{{ url('/lessons/' . $course) }}"
           class="inline-block bg-warmOrange text-white px-6 py-2 rounded-lg hover:bg-skyBlue transition font-semibold">
            Go to Lessons
        </a>
    </div>

    <!-- GAME -->
    <div id="gameScreen" class="hidden mt-4">

        <!-- LIVES + PROGRESS -->
        <div class="bg-softCream rounded-2xl px-5 py-3 shadow mb-4 flex items-center justify-between">
            <div>
                <span class="font-semibold text-deepChocolate mr-2">Lives:</span>
                <span id="livesDisplay"></span>
            </div>
            <div class="bg-warmOrange text-white text-sm font-bold px-4 py-1 rounded-full">
                Q <span id="qNum">1</span> / <span id="qTotal">5</span>
            </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div id="progressBar" class="bg-warmOrange h-2 rounded-full transition-all" style="width:0%"></div>
        </div>

        <!-- MAZE -->
        <div class="flex justify-center mb-3">
            <div id="mazeGrid"></div>
        </div>

        <p class="text-center text-sm text-gray-500 mb-4 font-semibold">
            Step <span id="stepCount">0</span> / <span id="stepTotal">0</span>
        </p>

        <!-- QUESTION CARD -->
        <div class="bg-softCream rounded-2xl p-5 shadow-md mb-4">
            <p class="text-xs text-gray-400 font-semibold uppercase mb-1">
                Question <span id="qNumCard">1</span>
            </p>
            <p id="questionText" class="text-lg font-bold text-deepChocolate mb-4"></p>
            <div id="optionsArea" class="space-y-2"></div>

            <!-- FEEDBACK -->
            <div id="feedback" class="hidden mt-4 p-3 rounded-xl text-center font-semibold text-sm"></div>
        </div>

        <!-- NEXT BTN -->
        <button id="nextBtn"
            class="hidden w-full py-3 bg-warmOrange text-white rounded-xl font-bold hover:bg-skyBlue transition">
            Next Question <i class="fa-solid fa-arrow-right"></i>
        </button>

        <!-- XP BAR -->
        <div class="mt-4 flex items-center justify-between bg-softCream rounded-xl px-4 py-2 shadow">
            <span class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-bolt text-warmOrange"></i> Session XP
            </span>
            <span id="xpDisplay" class="font-bold text-warmOrange">0</span>
        </div>

    </div>

    <!-- WIN SCREEN -->
    <div id="winScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <div class="text-6xl mb-3">🏆</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Maze Complete!</h2>
        <p class="text-gray-500 mb-1">You guided the duck through the maze!</p>
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

    <!-- LOSE SCREEN -->
    <div id="loseScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md mt-6">
        <div class="text-6xl mb-3">💔</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Out of Lives!</h2>
        <p class="text-gray-500 mb-6">Don't give up — try again!</p>
        <button onclick="restartGame()"
            class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
            Try Again
        </button>
    </div>

</main>

<script>
    window.COURSE = "{{ $course }}";
</script>
@vite(['resources/js/games/code-maze.js'])
</body>
</html>
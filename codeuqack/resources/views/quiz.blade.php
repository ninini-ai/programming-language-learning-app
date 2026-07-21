<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quiz</title>
  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-sunnyYellow min-h-screen pb-24">

<!-- TOP NAV -->
<nav class="bg-white/70 shadow">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-10 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">CodeQuack</span>
        <button onclick="window.history.back()"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition text-sm">
            <i class="fa-solid fa-arrow-left"></i> Back
        </button>
    </div>
</nav>

<main class="max-w-2xl mx-auto px-4 pt-8">

    <!-- LOCKED -->
    <div id="lockedScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md">
        <i class="fa-solid fa-lock text-6xl text-warmOrange mb-4"></i>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Quiz Locked</h2>
        <p class="text-gray-500 mb-6" id="lockedMsg">
            Complete the required lessons before taking this quiz.
        </p>
        <button onclick="window.history.back()"
            class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
            Go Back to Lessons
        </button>
    </div>

    <!-- QUIZ -->
    <div id="quizScreen" class="hidden">

        <!-- HEADER -->
        <div class="bg-softCream rounded-2xl px-5 py-3 shadow mb-4 flex items-center justify-between">
            <h1 id="quizTitle" class="text-lg font-bold text-deepChocolate"></h1>
            <div class="bg-warmOrange text-white text-sm font-bold px-4 py-1 rounded-full">
                Q <span id="qCurrent">1</span> / <span id="qTotalDisplay">1</span>
            </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-5">
            <div id="progressBar" class="bg-warmOrange h-2 rounded-full transition-all" style="width:0%"></div>
        </div>

        <!-- QUESTION CARD -->
        <div class="bg-softCream rounded-2xl p-6 shadow-md mb-4">
            <p id="questionText" class="text-lg font-bold text-deepChocolate mb-4"></p>

            <!-- HINT -->
            <div id="hintBox" class="hidden mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                <i class="fa-solid fa-lightbulb"></i> <span id="hintText"></span>
            </div>

            <div id="optionsArea" class="space-y-2"></div>

            <!-- FEEDBACK -->
            <div id="feedback" class="hidden mt-4 p-4 rounded-xl text-center font-semibold text-sm"></div>
        </div>

        <!-- ACTIONS -->
        <div class="flex gap-3">
            <button id="hintBtn"
                class="flex-1 py-3 bg-white border-2 border-warmOrange text-warmOrange
                       rounded-xl font-semibold hover:bg-warmOrange hover:text-white transition">
                <i class="fa-solid fa-lightbulb"></i> Hint
            </button>
            <button id="nextBtn"
                class="hidden flex-1 py-3 bg-warmOrange text-white rounded-xl
                       font-semibold hover:bg-skyBlue transition">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        <!-- SCORE -->
        <div class="mt-4 flex items-center justify-between bg-softCream rounded-xl px-4 py-2 shadow">
            <span class="text-sm font-semibold text-deepChocolate">
                <i class="fa-solid fa-star text-warmOrange"></i> Score
            </span>
            <span class="font-bold text-warmOrange">
                <span id="scoreDisplay">0</span> / <span id="scoreTotalDisplay">0</span>
            </span>
        </div>

    </div>

    <!-- PASS SCREEN -->
    <div id="passScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md">
        <div class="text-6xl mb-3">🎉</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Quiz Passed!</h2>
        <p class="text-gray-500 mb-1">Well done! You scored:</p>
        <p class="text-3xl font-bold text-warmOrange mb-1">
            <span id="passPct">0</span>%
        </p>
        <p class="text-green-600 font-semibold mb-6">+20 XP Earned</p>
        <div class="flex gap-3 justify-center">
            <button id="nextLessonBtn"
                class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
                <i class="fa-solid fa-arrow-right"></i> Next Lesson
            </button>
            <button onclick="window.history.back()"
                class="px-6 py-2 bg-white border-2 border-warmOrange text-warmOrange
                       rounded-lg hover:bg-warmOrange hover:text-white transition font-semibold">
                Back to Lessons
            </button>
        </div>
    </div>

    <!-- FAIL SCREEN -->
    <div id="failScreen" class="hidden text-center bg-softCream rounded-2xl p-10 shadow-md">
        <div class="text-6xl mb-3">😔</div>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Not Quite!</h2>
        <p class="text-gray-500 mb-1">You scored:</p>
        <p class="text-3xl font-bold text-red-400 mb-1">
            <span id="failPct">0</span>%
        </p>
        <p class="text-gray-500 mb-6">You need 60% to pass. Review the lessons and try again!</p>
        <div class="flex gap-3 justify-center">
            <button onclick="retryQuiz()"
                class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
                <i class="fa-solid fa-rotate-right"></i> Retry Quiz
            </button>
            <button onclick="window.history.back()"
                class="px-6 py-2 bg-white border-2 border-warmOrange text-warmOrange
                       rounded-lg hover:bg-warmOrange hover:text-white transition font-semibold">
                Review Lessons
            </button>
        </div>
    </div>

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

@vite(['resources/js/quiz.js'])
</body>
</html>
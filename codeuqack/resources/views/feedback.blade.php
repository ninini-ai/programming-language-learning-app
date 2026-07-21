<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Feedback</title>
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
        <a href="{{ url('/dashboard') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition text-sm">
            <i class="fa-solid fa-arrow-left"></i> Back
        </a>
    </div>
</nav>

<main class="max-w-lg mx-auto px-4 pt-10">

    <!-- HEADER -->
    <div class="text-center mb-8">
        <div class="w-16 h-16 bg-warmOrange rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-comment-dots text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-deepChocolate">Send Feedback</h1>
        <p class="text-gray-500 text-sm mt-1">Help us improve CodeQuack 🚀</p>
    </div>

    <!-- FORM CARD -->
    <div class="bg-softCream rounded-2xl shadow-md p-6">

        <!-- Type selector -->
        <label class="block text-sm font-semibold text-deepChocolate mb-1">
            Feedback Type
        </label>
        <div class="grid grid-cols-3 gap-2 mb-5">
            <button data-type="bug"
                class="type-btn active-type py-2 px-3 rounded-xl border-2 text-sm font-semibold transition
                       border-warmOrange bg-warmOrange text-white">
                🐛 Bug Report
            </button>
            <button data-type="suggestion"
                class="type-btn py-2 px-3 rounded-xl border-2 text-sm font-semibold transition
                       border-gray-200 bg-white text-deepChocolate hover:border-warmOrange">
                💡 Suggestion
            </button>
            <button data-type="content"
                class="type-btn py-2 px-3 rounded-xl border-2 text-sm font-semibold transition
                       border-gray-200 bg-white text-deepChocolate hover:border-warmOrange">
                📝 Content Issue
            </button>
        </div>

        <!-- Message -->
        <label class="block text-sm font-semibold text-deepChocolate mb-1">
            Your Message
        </label>
        <textarea id="message" rows="5"
            placeholder="Describe the bug, share your suggestion, or tell us what's wrong..."
            class="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-deepChocolate
                   outline-none focus:border-warmOrange transition resize-none mb-2">
        </textarea>

        <!-- Character count -->
        <p id="charCount" class="text-xs text-gray-400 text-right mb-4">0 / 500</p>

        <!-- Sentiment preview (shown after analysis) -->
        <div id="sentimentBadge" class="hidden mb-4 flex items-center gap-2 text-sm font-semibold">
            <span class="text-gray-500">Tone detected:</span>
            <span id="sentimentLabel" class="px-3 py-1 rounded-full text-white text-xs font-bold"></span>
        </div>

        <!-- Submit -->
        <button id="sendFeedback"
            class="w-full py-3 bg-warmOrange text-white rounded-xl font-bold
                   hover:bg-skyBlue transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-paper-plane"></i>
            Submit Feedback
        </button>

        <!-- Status message -->
        <div id="status" class="hidden mt-4 p-4 rounded-xl text-center text-sm font-semibold"></div>

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
        <a href="{{ url('/feedback') }}" class="flex flex-col items-center text-skyBlue transition">
            <i class="fa-solid fa-comment-dots text-xl"></i>
            <span class="hidden lg:inline mt-1 text-xl">Feedback</span>
        </a>
    </div>
</div>

@vite(['resources/js/feedback.js'])
</body>
</html>
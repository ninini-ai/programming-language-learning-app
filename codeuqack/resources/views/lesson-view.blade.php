<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Lesson</title>
  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])

  <style>
    /* ── Side drawer ── */
    #qaPanel {
      position: fixed;
      top: 0;
      right: -420px;
      width: 400px;
      height: 100vh;
      z-index: 999;
      transition: right 0.3s ease;
      overflow-y: auto;
      box-shadow: -4px 0 24px rgba(0,0,0,0.12);
    }

    #qaPanel.open {
      right: 0;
    }

    /* Backdrop when drawer is open */
    #qaBackdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.25);
      z-index: 998;
    }

    #qaBackdrop.open {
      display: block;
    }

    /* On small screens make it full width */
    @media (max-width: 480px) {
      #qaPanel {
        width: 100vw;
        right: -100vw;
      }
    }
  </style>
</head>

<body class="bg-softCream min-h-screen pb-24">

<!-- TOP NAV -->
<nav class="bg-white shadow">
    <div class="container mx-auto flex items-center px-4 py-3">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-9 h-auto mr-2">
        <span class="text-xl font-extrabold text-deepChocolate">CodeQuack</span>
        <button id="backBtn"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded-full hover:bg-skyBlue transition text-sm font-semibold">
            <i class="fa-solid fa-arrow-left"></i> Back
        </button>
    </div>
</nav>

<main class="max-w-5xl mx-auto px-4 pt-6">

    <!-- LOCKED STATE -->
    <div id="lockedScreen" class="hidden text-center bg-white rounded-2xl p-10 shadow-md mt-6">
        <i class="fa-solid fa-lock text-6xl text-warmOrange mb-4"></i>
        <h2 class="text-2xl font-bold text-deepChocolate mb-2">Lesson Locked</h2>
        <p class="text-gray-500 mb-6">Complete the previous lesson first to unlock this one.</p>
        <button onclick="window.history.back()"
            class="px-6 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue transition font-semibold">
            Go Back
        </button>
    </div>

    <!-- LESSON CONTENT -->
    <div id="lessonScreen" class="hidden">

        <!-- TITLE ROW with Q&A button -->
        <div class="flex items-center justify-between mb-4 gap-3">
            <h1 id="lessonTitle" class="text-2xl font-bold text-deepChocolate"></h1>

            <button id="qaToggleBtn"
                title="Ask a question about this lesson"
                class="flex items-center gap-2 px-4 py-2 bg-warmOrange text-white
                       rounded-full font-semibold text-sm hover:bg-skyBlue transition
                       shadow whitespace-nowrap">
                <span class="w-5 h-5 rounded-full bg-white text-warmOrange font-extrabold
                             text-xs flex items-center justify-center">!</span>
                Ask a Question
            </button>
        </div>

        <!-- LESSON LAYOUT -->
        <div class="bg-sunnyYellow rounded-2xl p-5 mb-5">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <!-- LEFT: IMAGE + VIDEO -->
                <div id="mediaColumn" class="flex flex-col gap-4">
                    <div id="imageBox" class="hidden bg-gray-300 rounded-xl overflow-hidden min-h-[140px]">
                        <img id="lessonImage" class="w-full h-full object-cover" alt="Lesson image">
                    </div>
                    <div id="videoBox" class="hidden bg-gray-300 rounded-xl overflow-hidden min-h-[140px]">
                        <iframe id="lessonVideo"
                            class="w-full h-full min-h-[180px]"
                            frameborder="0"
                            allowfullscreen></iframe>
                    </div>
                    <div id="noMediaBox" class="hidden bg-gray-200 rounded-xl flex items-center
                                                justify-center min-h-[140px] text-gray-500 font-semibold">
                        No media for this lesson
                    </div>
                </div>

                <!-- RIGHT: TEXT CONTENT -->
                <div class="bg-softCream rounded-2xl p-6 min-h-[260px]">
                    <div id="lessonContent" class="text-deepChocolate prose max-w-none"></div>
                </div>

            </div>
        </div>

        <!-- NAVIGATION -->
        <div class="flex justify-between items-center mt-2 gap-3">
            <button id="prevBtn"
                class="px-5 py-2 bg-gray-300 text-deepChocolate rounded-lg hover:bg-gray-400
                       transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                <i class="fa-solid fa-arrow-left"></i> Previous
            </button>

            <span id="progressText" class="text-sm text-gray-500 font-semibold"></span>

            <button id="nextBtn"
                class="px-5 py-2 bg-warmOrange text-white rounded-lg hover:bg-skyBlue
                       transition font-semibold">
                Next <i class="fa-solid fa-arrow-right"></i>
            </button>

            <button id="completeBtn"
                class="hidden px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                       transition font-semibold">
                <i class="fa-solid fa-check"></i> Complete Lesson
            </button>
        </div>

    </div>

</main>

<!-- ═══════════════════════════════════════════════════
     BACKDROP (click to close drawer)
═══════════════════════════════════════════════════ -->
<div id="qaBackdrop"></div>

<!-- ═══════════════════════════════════════════════════
     Q&A SIDE DRAWER
═══════════════════════════════════════════════════ -->
<div id="qaPanel" class="bg-white flex flex-col">

    <!-- Sticky header -->
    <div class="sticky top-0 bg-white z-10 flex items-center justify-between
                px-5 py-4 border-b border-gray-100 shadow-sm">
        <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-warmOrange text-white font-extrabold
                         flex items-center justify-center text-sm">!</span>
            <h2 class="text-base font-bold text-deepChocolate">Ask About This Lesson</h2>
        </div>
        <button id="qaCloseBtn"
            class="w-8 h-8 flex items-center justify-center rounded-full
                   hover:bg-gray-100 text-gray-400 hover:text-warmOrange transition text-lg">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- Scrollable body -->
    <div class="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

        <!-- Search bar -->
        <div class="flex gap-2">
            <input id="qaInput"
                type="text"
                placeholder="e.g. What is a variable?"
                class="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm
                       font-semibold text-deepChocolate outline-none
                       focus:border-warmOrange transition"
            />
            <button id="qaSubmitBtn"
                class="px-4 py-3 bg-warmOrange text-white rounded-xl font-bold
                       hover:bg-skyBlue transition text-sm whitespace-nowrap">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>

        <!-- Loading -->
        <div id="qaLoading" class="hidden text-center py-3 text-warmOrange font-semibold text-sm">
            <i class="fa-solid fa-spinner fa-spin mr-1"></i> Finding answer…
        </div>

        <!-- Result -->
        <div id="qaResult" class="hidden flex flex-col gap-3">

            <!-- RELEVANT ANSWER -->
            <div id="qaAnswer" class="hidden bg-green-50 border border-green-200 rounded-xl p-4">
                <p class="text-xs text-green-600 font-bold uppercase tracking-wide mb-2">
                    <i class="fa-solid fa-circle-check"></i> Answer
                </p>
                <p id="qaAnswerText" class="text-deepChocolate text-sm leading-relaxed"></p>
            </div>

            <!-- WARNING -->
            <div id="qaWarning" class="hidden bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                <p class="text-xs text-yellow-700 font-bold uppercase tracking-wide mb-2">
                    <i class="fa-solid fa-triangle-exclamation"></i> Off Topic
                </p>
                <p id="qaWarningText" class="text-yellow-800 text-sm"></p>
            </div>

            <!-- SUGGESTIONS -->
            <div id="qaSuggestionsBox" class="hidden">
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">
                    <i class="fa-solid fa-lightbulb text-warmOrange"></i>
                    <span id="qaSuggestionsLabel">Suggested questions</span>
                </p>
                <div id="qaSuggestions" class="flex flex-wrap gap-2"></div>
            </div>

        </div>

        <!-- Session history -->
        <div id="qaHistory" class="space-y-3"></div>

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

@vite(['resources/js/lesson-view.js'])

{{-- Override the toggle behaviour for the drawer --}}
<script>
  // Replace the inline toggle so it uses the drawer open/close classes
  // instead of the old hidden/show approach
  const _qaToggle  = document.getElementById("qaToggleBtn");
  const _qaPanel   = document.getElementById("qaPanel");
  const _qaClose   = document.getElementById("qaCloseBtn");
  const _qaBackdrop = document.getElementById("qaBackdrop");

  function openDrawer() {
    _qaPanel.classList.add("open");
    _qaBackdrop.classList.add("open");
    document.getElementById("qaInput").focus();
  }

  function closeDrawer() {
    _qaPanel.classList.remove("open");
    _qaBackdrop.classList.remove("open");
  }

  // These override the event listeners added by lesson-view.js
  _qaToggle.addEventListener("click",   openDrawer);
  _qaClose.addEventListener("click",    closeDrawer);
  _qaBackdrop.addEventListener("click", closeDrawer);
</script>

</body>
</html>
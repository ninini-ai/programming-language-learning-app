{{-- games.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Games</title>
    <link rel="icon" type="image/png" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
    @vite(['resources/css/app.css'])
</head>

<body class="bg-sunnyYellow min-h-screen pb-24">

<!-- TOP NAV -->
<nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
    <div class="container mx-auto flex items-center px-4 py-2">
        <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-12 h-auto mr-2">
        <span class="text-2xl font-extrabold text-deepChocolate">CodeQuack</span>
        <button id="logoutBtn" class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
    </div>
</nav>

<main class="max-w-4xl mx-auto px-4 pt-24 pb-10">

    <!-- HEADER -->
    <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-deepChocolate">Learn Coding with Fun Games</h2>
        <p class="text-gray-500 mt-1">Play games to improve logic, problem-solving, and coding skills.</p>
    </div>

    <!-- COURSE TABS -->
    <div class="flex justify-center gap-3 mb-8">
        <button id="tabCpp"
            class="tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition">
            C++
        </button>
        <button id="tabPython"
            class="tab-btn px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition">
            Python
        </button>
    </div>

    <!-- C++ GAMES -->
    <div id="cppGames">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-bug text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bug Hunter</h3>
                <p class="text-sm text-gray-400 mb-4">Find and fix errors in C++ code to master debugging.</p>
                <a href="/games/cpp/bug-hunter"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-route text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Maze</h3>
                <p class="text-sm text-gray-400 mb-4">Guide your C++ code through a maze using correct logic.</p>
                <a href="/games/cpp/code-maze"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-code text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Sorter</h3>
                <p class="text-sm text-gray-400 mb-4">Arrange C++ code blocks in the correct order.</p>
                <a href="/games/cpp/code-sorter"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-bucket text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bucket Game</h3>
                <p class="text-sm text-gray-400 mb-4">Sort C++ values into the correct buckets.</p>
                <a href="/games/cpp/bucket-game"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

        </div>
    </div>

    <!-- PYTHON GAMES -->
    <div id="pythonGames" class="hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-bug text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bug Hunter</h3>
                <p class="text-sm text-gray-400 mb-4">Find and fix errors in Python code to master debugging.</p>
                <a href="/games/python/bug-hunter"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-route text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Maze</h3>
                <p class="text-sm text-gray-400 mb-4">Guide your Python code through a maze using correct logic.</p>
                <a href="/games/python/code-maze"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-code text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Sorter</h3>
                <p class="text-sm text-gray-400 mb-4">Arrange Python code blocks in the correct order.</p>
                <a href="/games/python/code-sorter"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

            <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition shadow">
                <i class="fa-solid fa-bucket text-4xl text-warmOrange mb-3"></i>
                <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bucket Game</h3>
                <p class="text-sm text-gray-400 mb-4">Sort Python values into the correct buckets.</p>
                <a href="/games/python/bucket-game"
                   class="inline-block bg-warmOrange hover:bg-skyBlue text-white px-4 py-2 rounded-lg text-sm transition">
                    Play
                </a>
            </div>

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


<script type="module">
    import { auth } from '/resources/js/firebase.js';
    import { signOut } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js';

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await signOut(auth);
        window.location.href = "{{ url('/') }}";
    });
</script>
@vite(['resources/js/games.js'])
@vite(['resources/js/logout.js'])
</body>
</html>
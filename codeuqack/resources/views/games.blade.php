<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
<title>Games</title>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
 @vite(['resources/css/app.css']) 
</head>
<body class=" min-h-screen flex flex-col p-6">
      <!-- Nav -->
 <nav class="fixed top-0 left-0 w-full bg-white/70 shadow z-50">
  <div class="container mx-auto flex items-center px-4 py-2">
    <img 
      src="{{ asset('/images/mascotCodeQuackapp.png') }}" 
      alt="CodeQuack Logo" 
      class="w-12 h-auto mr-2"
    >
    <span class="text-2xl font-extrabold text-deepChocolate">
      CodeQuack
    </span>
    <button id="logoutBtn" class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
{{-- <a href="/chat"
   class="bg-warmOrange text-white px-4 py-2 rounded-lg">
   Community Chat
</a> --}}
  </div>
</nav>
<main class="flex flex-col items-center w-full mt-20 pb-24">
{{-- <div class="mt-10">
  <div class="mb-6 text-center">
    <h2 class="text-2xl font-bold text-warmOrange">
      Learn Coding with Fun Games
    </h2>
    <p class="text-skyBlue text-sm mt-1">
      Play short games to improve logic, problem-solving, and coding skills.
    </p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Bug Hunter -->
    <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition">
      <i class="fa-solid fa-bug text-4xl text-warmOrange mb-3"></i>
      <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bug Hunter</h3>
      <p class="text-sm text-gray-300 mb-4">
        Find and fix errors in code to become better at debugging.
      </p>
      <a href="/games/bug-hunter"
         class="inline-block bg-warmOrange hover:bg-skyBlue px-4 py-2 rounded-lg text-sm">
        Play
      </a>
    </div>

    <!-- Code Maze -->
    <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition">
      <i class="fa-solid fa-route text-4xl text-warmOrange mb-3"></i>
      <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Maze</h3>
      <p class="text-sm text-gray-300 mb-4">
        Guide your code through a maze using the correct logic steps.
      </p>
      <a href="/games/code-maze"
         class="inline-block bg-warmOrange hover:bg-skyBlue px-4 py-2 rounded-lg text-sm">
        Play
      </a>
    </div>

    <!-- Code Sorter -->
    <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition">
      <i class="fa-solid fa-code text-4xl text-warmOrange mb-3"></i>
      <h3 class="text-deepChocolate text-lg font-semibold mb-2">Code Sorter</h3>
      <p class="text-sm text-gray-300 mb-4">
        Arrange code blocks in the correct order to make the program work.
      </p>
      <a href="/games/code-sorter"
         class="inline-block bg-warmOrange hover:bg-skyBlue px-4 py-2 rounded-lg text-sm">
        Play
      </a>
    </div>

    <!-- Bucket Game -->
    <div class="bg-softCream rounded-xl p-5 text-center hover:scale-105 transition">
      <i class="fa-solid fa-bucket text-4xl text-warmOrange mb-3"></i>
      <h3 class="text-deepChocolate text-lg font-semibold mb-2">Bucket Game</h3>
      <p class="text-sm text-gray-300 mb-4">
        Place values into the correct buckets to understand variables.
      </p>
      <a href="/games/bucket-game"
         class="inline-block bg-warmOrange hover:bg-skyBlue px-4 py-2 rounded-lg text-sm">
        Play
      </a>
    </div>

  </div>
</div> --}}

 <div class="mb-6 text-center">
    <h2 class="text-2xl font-bold text-warmOrange">
      Learn Coding with Fun Games
    </h2>
    <p class="text-skyBlue text-sm mt-1">
      Play short games to improve logic, problem-solving, and coding skills.
    </p>
  </div>
</main>
<div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-inner py-3">
  <div class="flex justify-center items-center gap-x-20  text-deepChocolate text-sm">
    
    <a href="{{ asset('lessons') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-book text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Courses</span>
    </a>

    <a href="{{ asset('lessons') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-trophy text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Leaderboard</span>
    </a>

    <a href="/chat-select" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-message text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Chat Rooms</span>
    </a>

    <a href="{{ asset('games') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-gamepad text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Games</span>
    </a>

    <a href="{{ asset('dashboard') }}" class="flex flex-col items-center hover:text-skyBlue transition">
      <i class="fa-solid fa-user text-xl"></i>
      <span class="hidden lg:inline mt-1 text-xl">Profile</span>
    </a>

  </div>
</div>
    </body>
</html>
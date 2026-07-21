<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leaderboard</title>
  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen p-6">
<a href="{{ url('/dashboard') }}"
           class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue transition text-sm">
            <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
        </a>
  <div class="max-w-2xl mx-auto">

    <!-- HEADER -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-deepChocolate">
        <i class="fa-solid fa-trophy"></i> Leaderboard
      </h1>
      <p class="text-gray-600">Top learners on CodeQuack</p>
    </div>

    <!-- TABS -->
    <div id="lbTabs" class="flex justify-center gap-3 mb-6">
      <button id="tabCpp"
        class="px-6 py-2 rounded-full font-semibold border-2 bg-warmOrange text-white border-warmOrange transition">
        C++
      </button>
      <button id="tabPython"
        class="px-6 py-2 rounded-full font-semibold border-2 bg-white text-deepChocolate border-gray-300 hover:border-warmOrange transition">
        Python
      </button>
    </div>

    <!-- LIST -->
    <div id="leaderboardList" class="bg-white rounded-xl shadow p-4 space-y-2">
      <p class="text-center text-gray-500">Loading…</p>
    </div>

  </div>

  @vite(['resources/js/leaderboard.js'])
</body>
</html>
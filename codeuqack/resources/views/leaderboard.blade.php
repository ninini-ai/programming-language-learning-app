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

  <!-- HEADER -->
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold text-deepChocolate">
        <i class="fa-solid fa-trophy text-xl"></i>  Leaderboard
    </h1>
    <p class="text-gray-600">Top learners on CodeQuack</p>
  </div>

  <!-- LEADERBOARD LIST -->
  <div id="leaderboardList"
    class="max-w-2xl mx-auto bg-white rounded-xl shadow p-4 space-y-3">

    <p class="text-center text-gray-500">Loading...</p>

  </div>

  @vite(['resources/js/leaderboard.js'])

</body>
</html>
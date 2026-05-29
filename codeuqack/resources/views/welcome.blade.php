<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CodeQuack — Learn C++ & Python</title>
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
    @vite(['resources/css/app.css','resources/js/app.js'])
<script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="bg-sunnyYellow text-slate-800 min-h-screen flex flex-col">
    <!-- Header -->
   <header class="flex items-center justify-center gap-3 px-5 py-3 bg-white/70 backdrop-blur shadow">
  <img class="w-12 h-auto" src="{{ asset('images/mascotCodeQuackapp.png') }}" alt="Logo">
  <h1 class="text-2xl font-extrabold text-deepChocolate">CodeQuack</h1>
</header>


    <!-- Main Section -->
    <main class="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 class="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4 mt-4">
            Learn <span class="text-mintGreen">C++ & Python</span> the fun way!
        </h2>
        <p class="max-w-xl text-gray-700 text-md mb-5">
                Short interactive lessons, logic games, quizzes with instant feedback
            and a gamified experience with XP, badges and streaks.
        </p>

        <div class="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl mb-5 flex flex-col items-center gap-5">
            <div class="flex items-center gap-6">
                <div class="relative bg-skyBlue text-deepChocolate p-3 rounded-3xl max-w-sm">
                    <p class="text-lg font-semibold">Hi, I’m Quacky!</p>
                    <p class="text-sm">
                        Welcome aboard <b>Quackers!</b> I’ll guide you through your coding journey. Ready to start?
                    </p>
                    <div class="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-skyBlue rotate-45"></div>
                </div>

                <div class="shrink-0">
                    <img src="{{ asset('images/wavingQuacky.png') }}" alt="Mascot" class="w-40 h-auto object-contain">
                </div>
            </div>

            <div class="w-full">
                <button id="signupPrimary"
                        type="button"
                         onclick="window.location.href='{{ route('auth') }}'"
                        class="mt-2 w-full bg-warmOrange text-white py-3 rounded-xl font-semibold hover:bg-skyBlue transition">
                    Get Started
                </button>
            </div>
        </div>

      
    </main>

    <!-- Footer -->
    <footer class="text-center py-4 text-gray-600 text-sm">
        © {{ date('Y') }} CodeQuack. All rights reserved.
    </footer>
</body>
</html>

{{-- resources/views/about.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><title>About Us - CodeQuack</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
@vite(['resources/css/app.css'])
</head>
<body class="bg-softCream min-h-screen px-5 py-8">
    <a href="{{ url('/profile') }}" class="text-warmOrange text-sm mb-4 inline-block">
        <i class="fa-solid fa-arrow-left mr-1"></i>Back to Profile
    </a>
    <div class="bg-white rounded-2xl shadow p-6">
        <h1 class="text-xl font-bold text-deepChocolate mb-3">About CodeQuack</h1>
        <p class="text-gray-600 leading-relaxed">
            CodeQuack is a gamified learning platform that helps students master C++ and Python
            through lessons, quizzes, XP, and leaderboards. Built to make programming practice
            feel less like homework and more like a game.
        </p>
    </div>
</body>
</html>
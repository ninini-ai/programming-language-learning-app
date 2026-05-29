<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Select Chat Room</title>

  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen flex items-center justify-center">

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
  <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-20 mx-auto mb-4">

  <h1 class="text-2xl font-bold text-deepChocolate mb-4">
    Choose Your Chat Room
  </h1>

  <div id="courseList" class="space-y-3">
   <!--buttons from js-->
  </div>

  <a href="{{ asset('dashboard') }}"
     class="flex justify-center items-center gap-2 mt-6 text-deepChocolate hover:text-skyBlue transition">
    <i class="fa-solid fa-circle-arrow-left text-md" ></i>
    <span class="font-bold text-md">Go Back to Profile</span>
  </a>
</div>

@vite(['resources/js/chat-select.js'])
</body>
</html>

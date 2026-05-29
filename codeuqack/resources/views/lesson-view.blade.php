<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lesson</title>
   <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen flex items-center justify-center p-6">

<div class="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6">

  <!-- TITLE -->
  <h1 id="lessonTitle" class="text-2xl font-bold text-deepChocolate mb-4 text-center"></h1>

  <!-- SLIDE CONTENT -->
  <div id="slideContainer" class="min-h-[200px]"></div>

  <!-- NAVIGATION -->
  <div class="flex justify-between items-center mt-6">

  <button id="prevBtn"
    class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
    Previous
  </button>

  <span id="progressText" class="text-sm text-gray-500"></span>

  <!-- NEXT BUTTON -->
  <button id="nextBtn"
    class="bg-warmOrange text-white px-4 py-2 rounded hover:bg-skyBlue">
    Next
  </button>

  <!-- COMPLETE BUTTON (hidden initially) -->
  <button id="completeBtn"
    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hidden">
    Complete Lesson 
  </button>

</div>

</div>

@vite(['resources/js/lesson-view.js'])

</body>
</html>
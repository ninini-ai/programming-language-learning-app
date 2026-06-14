<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quiz</title>
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen flex items-center justify-center p-6">

<div class="max-w-2xl w-full bg-white p-6 rounded-xl shadow">

  <h1 id="quizTitle" class="text-xl font-bold mb-4 text-center text-deepChocolate"></h1>

  <div id="questionBox"></div>

<div id="feedback"
class="mt-4 text-center font-semibold">
</div>

  <button id="nextBtn"
    class="mt-4 bg-warmOrange text-white px-4 py-2 rounded hidden">
    Next
  </button>

</div>

@vite(['resources/js/quiz.js'])

</body>
</html>
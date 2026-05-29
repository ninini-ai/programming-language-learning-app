<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Feedback</title>
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen flex items-center justify-center">

<div class="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
  <h2 class="text-xl font-bold text-center mb-4 text-deepChocolate">
    Send Feedback
  </h2>

  <select id="type" class="w-full border rounded p-2 mb-3">
    <option value="bug">Bug Report</option>
    <option value="suggestion">Suggestion</option>
    <option value="content">Content Issue</option>
  </select>

  <textarea id="message" rows="4" placeholder="Write your feedback here..." class="w-full border rounded p-2 mb-3"></textarea>

  <button
    id="sendFeedback"
    class="w-full bg-warmOrange hover:bg-skyBlue text-white p-2 rounded-lg"
  >
    Submit Feedback
  </button>

  <p id="status" class="text-center text-sm mt-3"></p>
</div>

@vite(['resources/js/feedback.js'])
</body>
</html>
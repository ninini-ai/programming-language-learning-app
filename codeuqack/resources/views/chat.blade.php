<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeQuack Chat</title>

  <link rel="icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen flex flex-col">

<header class="fixed top-0 left-0 w-full bg-white shadow z-50">
  <div class="flex items-center px-4 py-2">
    <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-12 mr-2">
    <span class="text-2xl font-bold text-deepChocolate">CodeQuack</span>

    <button id="logoutBtn"
      class="ml-auto px-4 py-2 bg-warmOrange text-white rounded hover:bg-skyBlue">
      Logout
    </button>
  </div>
</header>

<main class="pt-20 p-4 flex flex-col h-screen">
  <h2 id="roomTitle" class="text-3xl font-bold mb-2 text-center text-deepChocolate"></h2>

  <div id="messages" class="flex-1 overflow-y-auto bg-white p-4 rounded space-y-3"></div>
<div class="flex gap-2 mt-3">
  <input id="messageInput" class="flex-1 border rounded p-2" placeholder="Type message...">
  <button id="sendBtn" class="bg-skyBlue text-white px-4 rounded hover:bg-warmOrange">Send</button>
</div>

</main>

@vite(['resources/js/chat.js'])
</body>
</html>

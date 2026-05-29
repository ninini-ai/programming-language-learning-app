<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lessons</title>
   <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="p-6">

<h1 class="text-2xl font-bold text-center mb-6" id="courseTitle"></h1>

<div id="lessonList" class="space-y-3"></div>

@vite(['resources/js/lessons.js'])

</body>
</html>
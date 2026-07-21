
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Courses</title>
 <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('mascotCodeQuackapp.png') }}">
<link rel="shortcut icon" href="{{ asset('images/mascotCodeQuackapp.png') }}">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
  @vite(['resources/css/app.css'])
</head>

<body class="bg-softCream min-h-screen p-6">

<!-- HEADER -->
<div class="text-center mb-8">
  <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-20 mx-auto mb-2">
  <h1 class="text-3xl font-extrabold text-deepChocolate">Your Courses</h1>
  <p class="text-gray-600">Pick a course and start learning 🚀</p>
</div>

<!-- COURSE LIST -->
<div id="courseList" class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">


  <div class="bg-white rounded-xl shadow p-6 text-center animate-pulse col-span-full">
    <p class="text-gray-500">Loading your courses...</p>
  </div>

</div>

@vite(['resources/js/courses.js'])

</body>
</html>
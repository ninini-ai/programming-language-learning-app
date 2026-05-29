<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Sign In / Register</title>
<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/images/mascotCodeQuackapp.png') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
@vite(['resources/css/app.css'])

<style>
.fade-transition {
  transition: all 0.35s ease;
  opacity: 1;
  transform: translateY(0);
}

.fade-out {
  opacity: 0;
  transform: translateY(8px);
}


#loadingOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: none;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 999;
}
</style>
</head>

<body class="flex items-center justify-center min-h-screen bg-softCream">

<div id="loadingOverlay">Connecting… please wait</div>

<div class="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
  <div class="flex flex-col items-center text-center mb-5">
    <img src="{{ asset('images/mascotCodeQuackapp.png') }}" class="w-24 mb-3">
    <h1 class="text-2xl font-bold text-deepChocolate">Welcome to CodeQuack!</h1>
  </div>

  <div id="authForm" class="fade-transition">

    <div id="nameField" class="hidden mb-3">
      <div class="flex items-center border rounded p-2">
        <i class="fa-solid fa-user mr-2"></i>
        <input id="name" type="text" placeholder="Full Name" class="w-full outline-none">
      </div>
    </div>

    <div class="flex items-center border rounded mb-3 p-2">
      <i class="fa-solid fa-envelope mr-2"></i>
      <input id="email" type="email" placeholder="Enter email" class="w-full outline-none">
    </div>

    <div class="mb-2">
      <div class="flex items-center border rounded p-2 mb-1">
        <i class="fa-solid fa-lock mr-2"></i>
        <input id="password" type="password" placeholder="Enter password" class="w-full outline-none">
      </div>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" onclick="togglePassword()"> Show Password
      </label>
    </div>
<div id="forgotSection" class="text-right mt-1 mb-2">
  <button id="forgotBtn" class="text-sm text-indigo-500 hover:underline">Forgot password?</button>
</div>
    <div id="coursesField" class="hidden mb-3">
      <label class="flex justify-center mb-2">Select Courses</label>
      <div class="grid grid-cols-2 gap-2">
        <label><input type="checkbox" value="cpp" class="course-option"> C++</label>
        <label><input type="checkbox" value="python" class="course-option"> Python</label>
      </div>
    </div>

    <div class="flex gap-2">
      <button id="emailSignBtn" class="flex-1 p-2 bg-warmOrange text-white rounded-lg">
        Sign In
      </button>

      <button id="emailSignupBtn" class="flex-1 p-2 bg-warmOrange text-white rounded-lg hidden">
        Create Account
      </button>
    </div>

    <div class="mt-2 text-center">
      <button id="switchMode" class="text-sm text-indigo-500 hover:underline">
        Don't have an account? Create one instead
      </button>
    </div>

  </div>
</div>

<script>
function togglePassword() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}
</script>

@vite(['resources/js/auth.js'])
</body>
</html>

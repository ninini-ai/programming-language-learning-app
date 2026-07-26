<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Profile - CodeQuack</title>

    <link rel="icon"
          type="image/png"
          href="{{ asset('images/mascotCodeQuackapp.png') }}">

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">

    @vite(['resources/css/app.css'])
</head>

<body class="min-h-screen bg-softCream">

    <!-- Header -->
    <header class="bg-softCream text-deepChocolate
                   rounded-b-3xl px-5 py-4
                   flex items-center justify-between">

        <div class="flex items-center gap-3">
            <img src="{{ asset('images/mascotCodeQuackapp.png') }}"
                 class="w-10 h-10 object-contain">

            <h1 class="text-2xl font-bold">
                CodeQuack
            </h1>
        </div>

        <button id="backBtn"
                class="text-xl">
            <i class="fa-solid fa-arrow-left"></i>
        </button>

    </header>


    <!-- Main -->
    <main class="max-w-md mx-auto px-5 py-8">

        <!-- Profile Picture -->
        <div class="text-center mb-6">

            <div class="mx-auto w-24 h-24
                        rounded-full bg-warmOrange
                        flex items-center justify-center
                        text-white text-4xl">

                <i class="fa-solid fa-user"></i>

            </div>

            <h2 id="profileName"
                class="text-2xl font-bold text-deepChocolate mt-3">
                Loading...
            </h2>

            <p id="profileEmail"
               class="text-gray-500">
                Loading...
            </p>

        </div>


        <!-- Account Information -->
        <section class="bg-white rounded-3xl p-5 shadow-sm">

            <div class="flex items-center justify-between mb-5">

                <h2 class="text-lg font-bold text-deepChocolate">
                    Account Information
                </h2>

                <button id="editBtn"
                        class="text-warmOrange font-semibold">
                    Edit
                </button>

            </div>


            <!-- Name -->
            <div class="mb-4">

                <label class="text-sm text-gray-500">
                    Name
                </label>

                <div class="flex items-center gap-3
                            border rounded-xl p-3 mt-1">

                    <i class="fa-solid fa-user text-warmOrange"></i>

                    <input id="nameInput"
                           type="text"
                           class="w-full outline-none bg-transparent"
                           disabled>

                </div>

            </div>


            <!-- Email -->
            <div class="mb-5">

                <label class="text-sm text-gray-500">
                    Email
                </label>

                <div class="flex items-center gap-3
                            border rounded-xl p-3 mt-1">

                    <i class="fa-solid fa-envelope text-warmOrange"></i>

                    <input id="emailInput"
                           type="email"
                           class="w-full outline-none bg-transparent"
                           disabled>

                </div>

            </div>


            <!-- Save Button -->
            <button id="saveBtn"
                    class="hidden w-full p-3
                           bg-warmOrange text-white
                           rounded-xl font-semibold
                           hover:bg-skyBlue">

                Save Changes

            </button>
<!-- Change Password -->
<section class="bg-white rounded-3xl p-5 shadow-sm mt-5">

    <button id="changePasswordBtn"
            class="w-full flex items-center justify-between">

        <div class="flex items-center gap-3">

            <div class="w-10 h-10 rounded-xl bg-softCream
                        flex items-center justify-center
                        text-warmOrange">

                <i class="fa-solid fa-lock"></i>

            </div>

            <div class="text-left">

                <strong class="block text-deepChocolate">
                    Change Password
                </strong>

                <small class="text-gray-500">
                    Update your account password
                </small>

            </div>

        </div>

        <i class="fa-solid fa-chevron-right text-gray-400"></i>

    </button>


    <!-- Password Form -->
    <div id="passwordForm" class="hidden mt-5">

        <!-- Current Password -->
        <div class="mb-3">

            <label class="text-sm text-gray-500">
                Current Password
            </label>

            <div class="flex items-center gap-3 border rounded-xl p-3 mt-1">

                <i class="fa-solid fa-lock text-warmOrange"></i>

                <input id="currentPassword"
                       type="password"
                       placeholder="Enter current password"
                       class="w-full outline-none">

            </div>

        </div>


        <!-- New Password -->
        <div class="mb-3">

            <label class="text-sm text-gray-500">
                New Password
            </label>

            <div class="flex items-center gap-3 border rounded-xl p-3 mt-1">

                <i class="fa-solid fa-key text-warmOrange"></i>

                <input id="newPassword"
                       type="password"
                       placeholder="Enter new password"
                       class="w-full outline-none">

            </div>

        </div>


        <!-- Confirm Password -->
        <div class="mb-3">

            <label class="text-sm text-gray-500">
                Confirm New Password
            </label>

            <div class="flex items-center gap-3 border rounded-xl p-3 mt-1">

                <i class="fa-solid fa-key text-warmOrange"></i>

                <input id="confirmPassword"
                       type="password"
                       placeholder="Confirm new password"
                       class="w-full outline-none">

            </div>

        </div>


        <!-- Show Password -->
        <label class="flex items-center gap-2 text-sm mb-4 cursor-pointer">

            <input type="checkbox" id="showPasswords">

            Show Password

        </label>


        <button id="savePasswordBtn"
                class="w-full p-3 bg-warmOrange text-white
                       rounded-xl font-semibold
                       hover:bg-skyBlue">

            Change Password

        </button>

    </div>

</section>
        </section>


        <!-- More -->
        <section class="bg-white rounded-3xl p-5 shadow-sm mt-5">

            <h2 class="text-lg font-bold text-deepChocolate mb-4">
                More
            </h2>

            <div class="border-t">

                <!-- About -->
                <button class="moreBtn">
                    <i class="fa-solid fa-circle-info"></i>

                    <span>
                        <strong>About Us</strong>
                        <small>Learn more about the app</small>
                    </span>

                    <i class="fa-solid fa-chevron-right arrow"></i>
                </button>


                <!-- Help -->
                <button class="moreBtn">
                    <i class="fa-solid fa-circle-question"></i>

                    <span>
                        <strong>Help & Support</strong>
                        <small>FAQs and getting in touch</small>
                    </span>

                    <i class="fa-solid fa-chevron-right arrow"></i>
                </button>


                <!-- Privacy -->
                <button class="moreBtn">
                    <i class="fa-solid fa-shield-halved"></i>

                    <span>
                        <strong>Privacy Policy</strong>
                        <small>How we handle your data</small>
                    </span>

                    <i class="fa-solid fa-chevron-right arrow"></i>
                </button>


                <!-- Logout -->
                <button id="logoutBtn"
                        class="moreBtn text-red-500">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span>
                        <strong>Logout</strong>
                        <small>Sign out of your account</small>
                    </span>

                    <i class="fa-solid fa-chevron-right arrow"></i>

                </button>

            </div>

        </section>


        <p class="text-center text-sm text-gray-400 mt-6">
            App Version 1.0.0
        </p>

    </main>


    <script type="module" src="{{ Vite::asset('resources/js/profile.js') }}"></script>

</body>
</html>
import { auth, db } from "./firebase";

import {
    onAuthStateChanged,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword
} from "firebase/auth";

import {
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";


const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");

const logoutBtn = document.getElementById("logoutBtn");
const backBtn = document.getElementById("backBtn");


let currentUser = null;


// Check logged-in user
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "/auth";
        return;
    }

    currentUser = user;

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            const name = data.name || "User";
            const email = data.email || user.email;

            profileName.textContent = name;
            profileEmail.textContent = email;

            nameInput.value = name;
            emailInput.value = email;

        }

    } catch (error) {

        console.error(error);
        alert("Could not load profile.");

    }

});


// Edit profile
editBtn.onclick = () => {

    nameInput.disabled = false;

    // Keep email read-only
    emailInput.disabled = true;

    saveBtn.classList.remove("hidden");

    nameInput.focus();

};


// Save profile
saveBtn.onclick = async () => {

    const newName = nameInput.value.trim();

    if (!newName) {
        alert("Please enter your name.");
        return;
    }

    try {

        const userRef = doc(db, "users", currentUser.uid);

        await updateDoc(userRef, {
            name: newName
        });

        profileName.textContent = newName;

        nameInput.disabled = true;

        saveBtn.classList.add("hidden");

        alert("Profile updated successfully!");

    } catch (error) {

        console.error(error);
        alert("Could not update profile.");

    }

};


// Logout
logoutBtn.onclick = async () => {

    try {

        await signOut(auth);

        window.location.href = "/auth";

    } catch (error) {

        alert("Logout failed.");

    }

};


// Back to dashboard
backBtn.onclick = () => {

    window.location.href = "/dashboard";

};

// Change Password

const changePasswordBtn = document.getElementById("changePasswordBtn");
const passwordForm = document.getElementById("passwordForm");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const savePasswordBtn = document.getElementById("savePasswordBtn");
const showPasswords = document.getElementById("showPasswords");


// Open / close password form
changePasswordBtn.onclick = () => {

    passwordForm.classList.toggle("hidden");

};


// Show passwords
showPasswords.onclick = () => {

    const type = showPasswords.checked ? "text" : "password";

    currentPassword.type = type;
    newPassword.type = type;
    confirmPassword.type = type;

};


// Save new password
savePasswordBtn.onclick = async () => {

    const oldPassword = currentPassword.value.trim();
    const password = newPassword.value.trim();
    const confirm = confirmPassword.value.trim();


    // Check fields
    if (!oldPassword || !password || !confirm) {

        alert("Please fill all password fields.");

        return;
    }


    // Check new password
    if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {

        alert(
            "Password must be at least 8 characters and include a special character (!@#$%^&*)"
        );

        return;
    }


    // Check confirmation
    if (password !== confirm) {

        alert("New passwords do not match.");

        return;
    }


    // Prevent same password
    if (oldPassword === password) {

        alert("New password must be different from your current password.");

        return;
    }


    try {

        savePasswordBtn.disabled = true;
        savePasswordBtn.textContent = "Changing...";


        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            oldPassword
        );

        await reauthenticateWithCredential(
            currentUser,
            credential
        );


        // Update password
        await updatePassword(
            currentUser,
            password
        );


        alert("Password changed successfully!");


        // Clear fields
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        passwordForm.classList.add("hidden");


    } catch (error) {

        console.error(error);


        if (error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-credential") {

            alert("Current password is incorrect.");

        } else if (error.code === "auth/weak-password") {

            alert("Password is too weak.");

        } else {

            alert("Could not change password. Please try again.");

        }

    } finally {

        savePasswordBtn.disabled = false;
        savePasswordBtn.textContent = "Change Password";

    }

};
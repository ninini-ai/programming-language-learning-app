import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ── UI ────────────────────────────────────────────────
const sendBtn     = document.getElementById("sendFeedback");
const statusEl    = document.getElementById("status");
const messageEl   = document.getElementById("message");
const charCountEl = document.getElementById("charCount");
const typeBtns    = document.querySelectorAll(".type-btn");

// ── State ─────────────────────────────────────────────
let currentUser = null;
let selectedType = "bug";

// ── Auth ──────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
    currentUser = user;
});

// ── Type selector ─────────────────────────────────────
typeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedType = btn.dataset.type;

        typeBtns.forEach(b => {
            b.className =
                "type-btn py-2 px-3 rounded-xl border-2 text-sm font-semibold transition border-gray-200 bg-white text-deepChocolate hover:border-warmOrange";
        });

        btn.className =
            "type-btn active-type py-2 px-3 rounded-xl border-2 text-sm font-semibold transition border-warmOrange bg-warmOrange text-white";
    });
});

// ── Character Counter ─────────────────────────────────
messageEl.addEventListener("input", () => {
    if (messageEl.value.length > 500) {
        messageEl.value = messageEl.value.slice(0, 500);
    }

    charCountEl.textContent = `${messageEl.value.length} / 500`;

    if (messageEl.value.length >= 500) {
        charCountEl.classList.add("text-red-500");
    } else {
        charCountEl.classList.remove("text-red-500");
    }
});

// ── Status Message ────────────────────────────────────
function showStatus(message, success = true) {
    statusEl.textContent = message;

    statusEl.className = `mt-4 p-4 rounded-xl text-center text-sm font-semibold ${
        success
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-600 border border-red-200"
    }`;

    statusEl.classList.remove("hidden");
}

// ── Submit Feedback ───────────────────────────────────
sendBtn.addEventListener("click", async () => {

    statusEl.classList.add("hidden");

    if (!currentUser) {
        showStatus("Please log in first!", false);
        return;
    }

    const message = messageEl.value.trim();

    if (!message) {
        showStatus("Please enter your feedback.", false);
        messageEl.focus();
        return;
    }

    if (message.length < 10) {
        showStatus("Please provide a little more detail.", false);
        messageEl.focus();
        return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Submitting...
    `;

    try {

        await addDoc(collection(db, "feedback"), {
            uid: currentUser.uid,
            email: currentUser.email,
            type: selectedType,
            message: message,
            createdAt: serverTimestamp()
        });

        showStatus("✅ Thank you! Your feedback has been submitted.");

        messageEl.value = "";
        charCountEl.textContent = "0 / 500";

    } catch (error) {
        console.error(error);
        showStatus("Failed to submit feedback. Please try again.", false);
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = `
        <i class="fa-solid fa-paper-plane"></i>
        Submit Feedback
    `;
});
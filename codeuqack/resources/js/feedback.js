import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ── UI ────────────────────────────────────────────────
const sendBtn        = document.getElementById("sendFeedback");
const statusEl       = document.getElementById("status");
const messageEl      = document.getElementById("message");
const charCountEl    = document.getElementById("charCount");
const sentimentBadge = document.getElementById("sentimentBadge");
const sentimentLabel = document.getElementById("sentimentLabel");
const typeBtns       = document.querySelectorAll(".type-btn");

// ── State ─────────────────────────────────────────────
let currentUser  = null;
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
      b.className = "type-btn py-2 px-3 rounded-xl border-2 text-sm font-semibold transition border-gray-200 bg-white text-deepChocolate hover:border-warmOrange";
    });
    btn.className = "type-btn active-type py-2 px-3 rounded-xl border-2 text-sm font-semibold transition border-warmOrange bg-warmOrange text-white";
  });
});

// ── Character counter ─────────────────────────────────
messageEl.addEventListener("input", () => {
  const len = messageEl.value.length;
  charCountEl.textContent = `${len} / 500`;
  if (len > 500) {
    charCountEl.classList.add("text-red-500");
    messageEl.value = messageEl.value.slice(0, 500);
  } else {
    charCountEl.classList.remove("text-red-500");
  }
});

// ── Sentiment Analysis via HuggingFace ────────────────
// Uses the inference API directly — free, no key needed for this model
async function getSentiment(text) {
  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ inputs: text }),
      }
    );

    if (!res.ok) {
      console.warn("HuggingFace status:", res.status);
      return "neutral";
    }

    const result = await res.json();
    console.log("HuggingFace raw result:", result);

    // Response is [[{label, score}, {label, score}]]
    // Pick the label with the highest score
    const scores = result?.[0];
    if (!Array.isArray(scores) || !scores.length) return "neutral";

    const top = scores.reduce((a, b) => (a.score > b.score ? a : b));
    const label = (top.label || "").toUpperCase();

    if (label === "POSITIVE") return "positive";
    if (label === "NEGATIVE") return "negative";
    return "neutral";

  } catch (err) {
    console.error("Sentiment error:", err);
    return "neutral";
  }
}

// ── Show sentiment badge ──────────────────────────────
function showSentiment(sentiment) {
  const config = {
    positive: { color: "bg-green-500",  emoji: "😊 Positive" },
    negative: { color: "bg-red-500",    emoji: "😞 Negative" },
    neutral:  { color: "bg-gray-400",   emoji: "😐 Neutral"  },
  };

  const s = config[sentiment] || config.neutral;
  sentimentLabel.textContent = s.emoji;
  sentimentLabel.className   = `px-3 py-1 rounded-full text-white text-xs font-bold ${s.color}`;
  sentimentBadge.classList.remove("hidden");
}

// ── Show status message ───────────────────────────────
function showStatus(msg, success = true) {
  statusEl.textContent = msg;
  statusEl.className   = `mt-4 p-4 rounded-xl text-center text-sm font-semibold
    ${success
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-red-100 text-red-600 border border-red-200"}`;
  statusEl.classList.remove("hidden");
}

// ── Submit ────────────────────────────────────────────
sendBtn.addEventListener("click", async () => {
  statusEl.classList.add("hidden");
  sentimentBadge.classList.add("hidden");

  // Guard: must be logged in
  if (!currentUser) {
    showStatus("Please log in first!", false);
    return;
  }

  const message = messageEl.value.trim();

  // Guard: empty message
  if (!message) {
    showStatus("Please write your feedback before submitting.", false);
    messageEl.focus();
    return;
  }

  // Guard: too short
  if (message.length < 10) {
    showStatus("Your feedback is too short. Please add more detail.", false);
    messageEl.focus();
    return;
  }

  // Loading state
  sendBtn.disabled      = true;
  sendBtn.innerHTML     = `<i class="fa-solid fa-spinner fa-spin"></i> Analysing & Submitting…`;

  try {
    // 1. Analyse sentiment
    const sentiment = await getSentiment(message);
    console.log("Final sentiment:", sentiment);

    // 2. Show badge before saving
    showSentiment(sentiment);

    // 3. Save to Firestore
    await addDoc(collection(db, "feedback"), {
      uid:       currentUser.uid,
      email:     currentUser.email,
      type:      selectedType,
      message,
      sentiment,
      createdAt: serverTimestamp(),
    });

    // 4. Success
    showStatus("✅ Feedback submitted! Thank you for helping us improve.", true);
    messageEl.value      = "";
    charCountEl.textContent = "0 / 500";

  } catch (err) {
    console.error("Submission error:", err);
    showStatus("Something went wrong: " + err.message, false);
  }

  // Reset button
  sendBtn.disabled  = false;
  sendBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Feedback`;
});
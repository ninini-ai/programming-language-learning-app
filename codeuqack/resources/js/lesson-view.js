import { db, auth } from "./firebase";
import {
  doc, getDoc,
  collection, getDocs,
  query, orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { completeLesson } from "./gamification";

// ── URL parsing ───────────────────────────────────────
const parts    = window.location.pathname.split("/");
const course   = parts[2];
const lessonId = parts[3];

// ── Screens ───────────────────────────────────────────
const lockedScreen = document.getElementById("lockedScreen");
const lessonScreen = document.getElementById("lessonScreen");

// ── Lesson UI ─────────────────────────────────────────
const lessonTitle   = document.getElementById("lessonTitle");
const imageBox      = document.getElementById("imageBox");
const lessonImage   = document.getElementById("lessonImage");
const videoBox      = document.getElementById("videoBox");
const lessonVideo   = document.getElementById("lessonVideo");
const noMediaBox    = document.getElementById("noMediaBox");
const lessonContent = document.getElementById("lessonContent");
const prevBtn       = document.getElementById("prevBtn");
const nextBtn       = document.getElementById("nextBtn");
const completeBtn   = document.getElementById("completeBtn");
const progressText  = document.getElementById("progressText");
const backBtn       = document.getElementById("backBtn");

// ── Q&A UI ────────────────────────────────────────────
const qaToggleBtn      = document.getElementById("qaToggleBtn");
const qaPanel          = document.getElementById("qaPanel");
const qaCloseBtn       = document.getElementById("qaCloseBtn");
const qaInput          = document.getElementById("qaInput");
const qaSubmitBtn      = document.getElementById("qaSubmitBtn");
const qaLoading        = document.getElementById("qaLoading");
const qaResult         = document.getElementById("qaResult");
const qaAnswer         = document.getElementById("qaAnswer");
const qaAnswerText     = document.getElementById("qaAnswerText");
const qaWarning        = document.getElementById("qaWarning");
const qaWarningText    = document.getElementById("qaWarningText");
const qaSuggestionsBox = document.getElementById("qaSuggestionsBox");
const qaSuggestionsLabel = document.getElementById("qaSuggestionsLabel");
const qaSuggestions    = document.getElementById("qaSuggestions");
const qaHistory        = document.getElementById("qaHistory");

// Track current lesson title for context
let currentLessonTitle = "";

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

backBtn.onclick = () => window.location.href = `/lessons/${course}`;

// ══════════════════════════════════════════════════════
//  Q&A PANEL LOGIC
// ══════════════════════════════════════════════════════

// Toggle panel open/close
qaToggleBtn.addEventListener("click", () => {
  qaPanel.classList.toggle("hidden");
  if (!qaPanel.classList.contains("hidden")) {
    qaInput.focus();
  }
});

qaCloseBtn.addEventListener("click", () => {
  hide(qaPanel);
});

// Submit on Enter key
qaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") askQuestion();
});

qaSubmitBtn.addEventListener("click", askQuestion);

async function askQuestion() {
  const question = qaInput.value.trim();
  if (!question) return;

  // Clear previous result
  hide(qaResult);
  hide(qaAnswer);
  hide(qaWarning);
  hide(qaSuggestionsBox);
  qaHistory; // keep history
  show(qaLoading);

  qaSubmitBtn.disabled = true;
  qaInput.disabled     = true;

  try {
    const res = await fetch("/api/qa", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || getCsrfToken(),
      },
      body: JSON.stringify({
        question,
        course,
        lessonTitle: currentLessonTitle,
      }),
    });

    const data = await res.json();

    hide(qaLoading);
    show(qaResult);

    // ── API/network error ─────────────────────────────
    if (data.error) {
      qaAnswerText.textContent = "⚠️ " + data.error;
      show(qaAnswer);
      qaSubmitBtn.disabled = false;
      qaInput.disabled     = false;
      return;
    }

    if (data.relevant === true) {

      // ── Show answer ───────────────────────────────
      qaAnswerText.textContent = data.answer || "No answer returned.";
      show(qaAnswer);
      hide(qaWarning);

      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        qaSuggestionsLabel.textContent = "You might also want to ask:";
        renderSuggestions(data.suggestions);
      }

      addToHistory(question, data.answer);

    } else {

      // ── Show warning ──────────────────────────────
      qaWarningText.textContent = data.warning ||
        "That question doesn't seem related to this lesson. Try a coding question!";
      hide(qaAnswer);
      show(qaWarning);

      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        qaSuggestionsLabel.textContent = "Try asking one of these instead:";
        renderSuggestions(data.suggestions);
      }
    }

    qaInput.value = "";

  } catch (err) {
    hide(qaLoading);
    show(qaResult);
    qaAnswerText.textContent = "⚠️ Network error. Please check your connection and try again.";
    show(qaAnswer);
    console.error("QA error:", err);
  }

  qaSubmitBtn.disabled = false;
  qaInput.disabled     = false;
}
// Render clickable suggestion chips
function renderSuggestions(suggestions) {
  qaSuggestions.innerHTML = "";
  suggestions.forEach(s => {
    const btn = document.createElement("button");
    btn.textContent = s;
    btn.className = `
      text-xs px-3 py-2 bg-softCream border border-warmOrange text-warmOrange
      rounded-full font-semibold hover:bg-warmOrange hover:text-white transition
    `;
    btn.addEventListener("click", () => {
      qaInput.value = s;
      askQuestion();
    });
    qaSuggestions.appendChild(btn);
  });
  show(qaSuggestionsBox);
}

// Add answered Q to visible session history
function addToHistory(question, answer, relevant) {
  if (!relevant) return; // only log real answers to history

  const item = document.createElement("div");
  item.className = "bg-gray-50 rounded-xl p-3 border border-gray-200";
  item.innerHTML = `
    <p class="text-xs text-gray-400 font-bold uppercase mb-1">
      <i class="fa-solid fa-circle-question text-warmOrange"></i> Your question
    </p>
    <p class="text-sm font-semibold text-deepChocolate mb-2">${question}</p>
    <p class="text-xs text-gray-600 leading-relaxed">${answer}</p>
  `;
  qaHistory.prepend(item);
}

// CSRF token helper (Laravel)
function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

// ══════════════════════════════════════════════════════
//  LESSON LOAD LOGIC
// ══════════════════════════════════════════════════════

async function init() {
  const user = auth.currentUser;

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const userData = userSnap.data() || {};
  const completedLessons = userData.progress?.[course]?.lessonsCompleted || [];

  const q = query(
    collection(db, "courses", course, "lessons"),
    orderBy("order")
  );
  const snapshot = await getDocs(q);

  const lessons = [];
  snapshot.forEach(d => lessons.push({ id: d.id, ...d.data() }));

  const currentIndex = lessons.findIndex(l => l.id === lessonId);

  if (currentIndex === -1) {
    document.body.innerHTML = "<h2 class='text-center mt-10'>Lesson not found</h2>";
    return;
  }

  // Lock check
  const isFirst    = currentIndex === 0;
  const prevLesson = lessons[currentIndex - 1];
  const isUnlocked = isFirst || completedLessons.includes(prevLesson?.id);

  if (!isUnlocked) {
    show(lockedScreen);
    return;
  }

  show(lessonScreen);
  renderLesson(lessons[currentIndex]);

  // Store lesson title for Q&A context
  currentLessonTitle = lessons[currentIndex].title || "";

  // Prev / Next setup
  const hasPrev            = currentIndex > 0;
  const hasNext            = currentIndex < lessons.length - 1;
  const isAlreadyCompleted = completedLessons.includes(lessonId);

  progressText.textContent = `Lesson ${currentIndex + 1} / ${lessons.length}`;
  prevBtn.disabled         = !hasPrev;

  prevBtn.onclick = () => {
    if (hasPrev)
      window.location.href = `/lesson/${course}/${lessons[currentIndex - 1].id}`;
  };

  if (hasNext) {
    nextBtn.onclick = () => {
      window.location.href = `/lesson/${course}/${lessons[currentIndex + 1].id}`;
    };
    if (isAlreadyCompleted) {
      show(nextBtn);
      hide(completeBtn);
    } else {
      hide(nextBtn);
      show(completeBtn);
    }
  } else {
    hide(nextBtn);
    if (isAlreadyCompleted) {
      hide(completeBtn);
    } else {
      show(completeBtn);
    }
  }

  completeBtn.onclick = async () => {
    await completeLesson(course, lessonId);
    alert("Lesson Completed! +10 XP");
    if (hasNext) {
      hide(completeBtn);
      show(nextBtn);
    } else {
      alert("You finished all lessons in this course! 🎉");
      window.location.href = `/lessons/${course}`;
    }
  };
}
function getYouTubeEmbedUrl(url) {
    try {
        // youtu.be links
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${id}`;
        }

        // youtube.com/watch?v=
        if (url.includes("watch?v=")) {
            const id = new URL(url).searchParams.get("v");
            return `https://www.youtube.com/embed/${id}`;
        }

        // already embed link
        if (url.includes("/embed/")) {
            return url;
        }

        return url;
    } catch {
        return url;
    }
}
function renderLesson(lesson) {
  lessonTitle.textContent  = lesson.title;
  lessonContent.innerHTML  = lesson.content || "<p>No content available.</p>";

  let hasMedia = false;

  if (lesson.imageUrl) {
    lessonImage.src = lesson.imageUrl;
    show(imageBox);
    hasMedia = true;
  } else {
    hide(imageBox);
  }

if (lesson.videoUrl) {
    lessonVideo.src = getYouTubeEmbedUrl(lesson.videoUrl);
    show(videoBox);
    hasMedia = true;
} else {
    hide(videoBox);
  }

  if (!hasMedia) show(noMediaBox);
  else           hide(noMediaBox);
}

onAuthStateChanged(auth, (user) => {
  if (!user) return location.href = "/auth";
  init();
});
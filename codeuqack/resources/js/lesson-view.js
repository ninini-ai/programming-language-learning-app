import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { completeLesson } from "./gamification"; 

// URL parsing
const parts = window.location.pathname.split("/");
const course = parts[2];
const lessonId = parts[3];

// state
let slides = [];
let currentSlide = 0;

// elements
const container = document.getElementById("slideContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progressText");

// LOAD LESSON
async function loadLesson() {
  const ref = doc(db, "courses", course, "lessons", lessonId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "<h2>Lesson not found</h2>";
    return;
  }

  const data = snap.data();

  document.getElementById("lessonTitle").textContent = data.title;

  if (!data.slides || data.slides.length === 0) {
    container.innerHTML = "<p>No slides available</p>";
    return;
  }

  slides = data.slides;
  renderSlide();
}

// RENDER SLIDE
function renderSlide() {
  const slide = slides[currentSlide];

  let html = `<h2 class="text-xl font-bold mb-3 text-deepChocolate">${slide.title}</h2>`;

  // TEXT
  if (slide.type === "text") {
    html += `<p class="text-gray-700 leading-relaxed">${slide.content}</p>`;
  }

  // LIST
  if (slide.type === "list") {
    html += `<ul class="list-disc pl-6 text-gray-700 space-y-1">`;
    slide.items.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += `</ul>`;
  }

  // CODE
  if (slide.type === "code") {
    html += `
      <pre class="bg-black text-green-400 p-4 rounded mt-3 overflow-x-auto text-sm">
<code>${slide.code}</code>
      </pre>
    `;
  }

  // VIDEO
  if (slide.type === "video") {
    const embed = slide.videoUrl.replace("watch?v=", "embed/");
    html += `
      <iframe 
        src="${embed}"
        class="w-full h-64 rounded mt-3"
        frameborder="0"
        allowfullscreen>
      </iframe>
    `;
  }

  container.innerHTML = html;

  progressText.textContent = `${currentSlide + 1} / ${slides.length}`;
  prevBtn.style.visibility = currentSlide === 0 ? "hidden" : "visible";

  nextBtn.textContent =
    currentSlide === slides.length - 1 ? "Finish" : "Next";
}

// NEXT BUTTON
nextBtn.onclick = async () => {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    renderSlide();
  } else {
    await completeLesson(course, lessonId);

    alert("Lesson Completed  +10 XP");
    window.history.back();
  }
};


prevBtn.onclick = () => {
  currentSlide--;
  renderSlide();
};


loadLesson();
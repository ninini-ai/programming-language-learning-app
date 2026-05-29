import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpXeZO_fuYIYfnJoCihWMJDVnXe4Uefv0",
  authDomain: "codequackdb-a4bb4.firebaseapp.com",
  projectId: "codequackdb-a4bb4",
  storageBucket: "codequackdb-a4bb4.appspot.com",
  messagingSenderId: "803113441027",
  appId: "1:803113441027:web:eab2eb0d9ff9463f183b36"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sendBtn = document.getElementById("sendFeedback");
const status  = document.getElementById("status");

let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// Call HuggingFace directly from JS
async function getSentiment(message) {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + import.meta.env.VITE_HUGGINGFACE_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    if (!response.ok) return "neutral";

    const result = await response.json();
    const label  = result[0][0]?.label ?? result[0]?.label ?? "NEUTRAL";

    if (label === "POSITIVE") return "positive";
    if (label === "NEGATIVE") return "negative";
    return "neutral";

  } catch (err) {
    console.error("Sentiment error:", err);
    return "neutral"; 
  }
}

sendBtn.onclick = async () => {
  // Reset status
  status.textContent = "";
  status.className = "text-center text-sm mt-3";

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const type    = document.getElementById("type").value;
  const message = document.getElementById("message").value.trim();

  if (!message) {
    alert("Feedback cannot be empty!");
    return;
  }

  try {
    // Get sentiment from HuggingFace
    const sentiment = await getSentiment(message);

    // Save everythingfirestore
    await addDoc(collection(db, "feedback"), {
      uid:       currentUser.uid,
      email:     currentUser.email,
      type,
      message,
      sentiment, 
      createdAt: serverTimestamp()
    });

    
    status.textContent = "Feedback submitted successfully!";
    status.classList.add("text-green-600");
    document.getElementById("message").value = "";

  } catch (err) {
    console.error("Submission error:", err);
    status.textContent = "Error: " + err.message;
    status.classList.add("text-red-600");
  }
};
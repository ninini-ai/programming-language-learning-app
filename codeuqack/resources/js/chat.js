import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

const params = new URLSearchParams(window.location.search);
const room = params.get("room");

if (!room) window.location.href = "/chat-select";

document.getElementById("roomTitle").textContent = room.toUpperCase() + " Chat Room";

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let warnings = 0;
const MAX_WARNINGS = 4;

onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = "/auth"; return; }

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const userName = userSnap.exists() ? userSnap.data().name : user.email;

  const messagesRef = collection(db, "chatRooms", room, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(docSnap => {
      const msg = docSnap.data();
      const div = document.createElement("div");
      div.className =
        "p-2 rounded max-w-[70%] " +
        (msg.uid === user.uid
          ? "bg-mintGreen text-white ml-auto"
          : "bg-softCream text-black mr-auto");
      div.textContent = `${msg.sender}: ${msg.text}`;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  sendBtn.onclick = async () => {
    const messageText = input.value.trim();
    if (!messageText) return;

    // block if banned
    if (warnings >= MAX_WARNINGS) {
      alert("You have been banned from chatting due to repeated violations.");
      input.disabled = true;
      sendBtn.disabled = true;
      return;
    }

    const bannedWords = ["badword1", "badword2", "badword3"];
    const containsBadWord = bannedWords.some(word =>
      messageText.toLowerCase().includes(word)
    );

    if (containsBadWord) {
      warnings++;
      const remaining = MAX_WARNINGS - warnings;

      if (warnings >= MAX_WARNINGS) {
        alert("Final warning! You are now banned from this chat.");
        input.disabled = true;
        sendBtn.disabled = true;
      } else {
        alert(`Warning ${warnings}/${MAX_WARNINGS}: Inappropriate language detected. ${remaining} warning(s) left before you are banned.`);
      }
      input.value = "";
      return;
    }

    try {
      await addDoc(messagesRef, {
        text: messageText,
        sender: userName,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      input.value = "";
    } catch (error) {
      console.error("Message send failed:", error);
      alert("Failed to send message. Check console.");
    }
  };

  document.getElementById("logoutBtn").onclick = () => signOut(auth).then(() => window.location.href = "/auth");
});
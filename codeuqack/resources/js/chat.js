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

// Send a system message when user enters
await addDoc(messagesRef, {
    type: "system",
    text: `${userName} entered the chat`,
    createdAt: serverTimestamp()
});

const q = query(messagesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
        const msg = docSnap.data();

        // Display system messages in the center
        if (msg.type === "system") {
            const system = document.createElement("div");
            system.className = "text-center text-gray-500 text-sm italic py-2";
            system.textContent = msg.text;

            messagesDiv.appendChild(system);
            return;
        }

        // Normal user messages...
        const div = document.createElement("div");
        div.className =
            "p-2 rounded max-w-[70%] " +
            (msg.uid === user.uid
                ? "bg-mintGreen text-white ml-auto"
                : "bg-softCream text-black mr-auto");

       const sender = document.createElement("div");
sender.className = "font-semibold text-sm";
sender.textContent = msg.sender;

const text = document.createElement("div");
text.className = "mt-1";
text.textContent = msg.text;

const time = document.createElement("div");
time.className = "text-[11px] opacity-70 text-right mt-2";

if (msg.createdAt?.toDate) {
    time.textContent = msg.createdAt.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

div.appendChild(sender);
div.appendChild(text);
div.appendChild(time);

        messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

  sendBtn.onclick = async () => {
    const messageText = input.value.trim();
    if (!messageText) return;

    // Block if banned
    if (warnings >= MAX_WARNINGS) {
        alert("You have been banned from chatting due to repeated violations.");
        input.disabled = true;
        sendBtn.disabled = true;
        return;
    }

    // Bad words filter
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
            alert(
                `Warning ${warnings}/${MAX_WARNINGS}: Inappropriate language detected. ${remaining} warning(s) left.`
            );
        }

        input.value = "";
        return;
    }

    try {

        // Save the actual chat message
        await addDoc(messagesRef, {
            text: messageText,
            sender: userName,
            uid: user.uid,
            createdAt: serverTimestamp()
        });

        input.value = "";

    } catch (error) {
        console.error("Message send failed:", error);
        alert("Failed to send message.");
    }
};
});
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "/";
    } catch (err) {
        console.error("Logout error:", err);
    }
});
import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

const container = document.getElementById("leaderboardList");

async function loadLeaderboard() {
  container.innerHTML = "<p class='text-center'>Loading...</p>";

  const q = query(
    collection(db, "users"),
    orderBy("xp", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  container.innerHTML = "";

  let rank = 1;

  snapshot.forEach(doc => {
    const user = doc.data();

    let medal = "";
    if (rank === 1) medal = "1";
    else if (rank === 2) medal = "2";
    else if (rank === 3) medal = "3";

    container.innerHTML += `
      <div class="flex items-center justify-between p-4 rounded-lg
        ${rank === 1 ? "bg-yellow-100" : "bg-softCream"}">

        <div class="flex items-center gap-3">
          <span class="text-lg font-bold w-6">${medal || "#" + rank}</span>
          <span class="font-semibold text-deepChocolate">
            ${user.name || user.email}
          </span>
        </div>

        <span class="font-bold text-warmOrange">
          ${user.xp || 0} XP
        </span>
      </div>
    `;

    rank++;
  });
}

loadLeaderboard();
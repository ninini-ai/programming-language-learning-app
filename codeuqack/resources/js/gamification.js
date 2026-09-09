// gamification.js
import { db, auth } from "./firebase";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
  Timestamp
} from "firebase/firestore";

function getTodayMidnight() {
  const d = new Date();

  d.setHours(0, 0, 0, 0);

  return d;
}
//streak
function calculateStreak(oldStreak) {
//f no streak exists, create one.
  let streak = oldStreak || {
    count: 0,
    lastActive: null
  };

  const now = new Date();
  if (!streak.lastActive) {

    return {
      count: 1,
      lastActive: Timestamp.now()
    };
  }

  const lastLogin = streak.lastActive.toDate();

  const elapsedMilliseconds =
    now.getTime() - lastLogin.getTime();

  const elapsedHours =
    elapsedMilliseconds / (1000 * 60 * 60); //ms into hrs

  const today = getTodayMidnight();
  const lastLoginDay = new Date(lastLogin);
  lastLoginDay.setHours(0, 0, 0, 0);
  if (today.getTime() === lastLoginDay.getTime()) {
    return {
      count: streak.count,
      lastActive: Timestamp.now()
    };
  }

  if (elapsedHours < 24) {
    return {
      count: streak.count + 1,
      lastActive: Timestamp.now()
    };
  }

  return {
    count: 1,
    lastActive: Timestamp.now()
  };
}
//levels
function calculateLevel(xp) {

  return Math.floor(xp / 100) + 1; //Every 100 XP = one level

}
/* daily streak update */
export async function updateDailyLoginStreak() {
  const user = auth.currentUser;

  if (!user) return;
  const ref = doc(
    db,
    "users",
    user.uid
  );
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const newStreak =
    calculateStreak(data.streak);
  await updateDoc(ref, {
    streak: newStreak
  });
  console.log(
    "Daily login streak updated:",
    newStreak.count
  );

}
/* complete lesson*/
export async function completeLesson(course, lessonId) {
  const user = auth.currentUser;
  if (!user) return;
  const ref =
    doc(db, "users", user.uid);
  const snap =
    await getDoc(ref);

  const data =
    snap.data();
  /* no dup lesson xp*/

  if (
    data.progress?.[course]?.lessonsCompleted?.includes(lessonId)
  ) {
    return;
  }

  const xpGain = 10;
  const currentXP =
    data.xp?.[course] || 0;

  const newXP =
    currentXP + xpGain;

  const newLevel =
    calculateLevel(newXP);

  await updateDoc(ref, {
    [`progress.${course}.lessonsCompleted`]:
      arrayUnion(lessonId),

    [`xp.${course}`]:
      increment(xpGain),

    [`level.${course}`]:
      newLevel
  });

  console.log("Lesson completed");
}

/* COmplete quiz */
export async function completeQuiz(course, quizId) {
  const user = auth.currentUser;
  if (!user) return;
  const ref =
    doc(db, "users", user.uid);
  const snap =
    await getDoc(ref);
  const data =
    snap.data();

  /* prevent duplicate quiz xp */

  if (
    data.progress?.[course]?.quizzesCompleted?.includes(quizId)
  ) {
    return;
  }
  const xpGain = 20;

  const currentXP =
    data.xp?.[course] || 0;
  const newXP =
    currentXP + xpGain;
  const newLevel =
    calculateLevel(newXP);

  await updateDoc(ref, {

    [`progress.${course}.quizzesCompleted`]:
      arrayUnion(quizId),

    [`xp.${course}`]:
      increment(xpGain),

    [`level.${course}`]:
      newLevel

  });


  console.log("Quiz completed");

}
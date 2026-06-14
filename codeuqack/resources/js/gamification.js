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

function calculateStreak(oldStreak) {

  let streak = oldStreak || {
    count: 0,
    lastActive: null
  };

  const today = getTodayMidnight();

  if (streak.lastActive) {

    const last = streak.lastActive.toDate();
    last.setHours(0, 0, 0, 0);

    const diffDays =
      (today - last) /
      (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak.count += 1;
    }
    else if (diffDays > 1) {
      streak.count = 1;
    }
  }
  else {
    streak.count = 1;
  }

  streak.lastActive = Timestamp.now();

  return streak;
}

function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/* =========================
   COMPLETE LESSON
========================= */

export async function completeLesson(course, lessonId) {

  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  const data = snap.data();

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

  const streak =
    calculateStreak(data.streak);

  await updateDoc(ref, {

    [`progress.${course}.lessonsCompleted`]:
      arrayUnion(lessonId),

    [`xp.${course}`]:
      increment(xpGain),

    [`level.${course}`]:
      newLevel,

    streak
  });

  console.log("Lesson completed");
}

/* =========================
   COMPLETE QUIZ
========================= */

export async function completeQuiz(course, quizId) {

  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  const data = snap.data();

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

  const streak =
    calculateStreak(data.streak);

  await updateDoc(ref, {

    [`progress.${course}.quizzesCompleted`]:
      arrayUnion(quizId),

    [`xp.${course}`]:
      increment(xpGain),

    [`level.${course}`]:
      newLevel,

    streak
  });

  console.log("Quiz completed");
}
import { db, auth } from "./firebase";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
  Timestamp
} from "firebase/firestore";

// -----------------------------
// COMMON HELPERS
// -----------------------------

function getTodayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function calculateStreak(oldStreak) {
  let streak = oldStreak || { count: 0, lastActive: null };

  const today = getTodayMidnight();

  if (streak.lastActive) {
    const last = streak.lastActive.toDate();
    last.setHours(0, 0, 0, 0);

    const diffDays = (today - last) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      // already active today
    } else if (diffDays === 1) {
      streak.count += 1;
    } else {
      streak.count = 1;
    }
  } else {
    streak.count = 1;
  }

  streak.lastActive = Timestamp.now();
  return streak;
}

function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

// -----------------------------
// COMPLETE LESSON
// -----------------------------
export async function completeLesson(course, lessonId) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  // SAFE INIT
  if (!data.progress[course]) {
    await updateDoc(ref, {
      [`progress.${course}`]: {
        lessonsCompleted: [],
        quizzesCompleted: []
      }
    });

    data.progress[course] = {
      lessonsCompleted: [],
      quizzesCompleted: []
    };
  }

  // prevent duplicate
  if (data.progress[course].lessonsCompleted.includes(lessonId)) return;

  const xpGain = 10;

  // STREAK
  const streak = calculateStreak(data.streak);

  // XP + LEVEL
  const newXP = (data.xp || 0) + xpGain;
  const newLevel = calculateLevel(newXP);

  // BADGES
  let badges = data.badges || [];

  if (newXP >= 50 && !badges.includes("xp50")) badges.push("xp50");
  if (newXP >= 100 && !badges.includes("xp100")) badges.push("xp100");

  if (streak.count >= 3 && !badges.includes("streak3")) {
    badges.push("streak3");
  }

  const completedLessons =
    data.progress[course].lessonsCompleted.length + 1;

  if (completedLessons === 5 && !badges.includes(`${course}_5_lessons`)) {
    badges.push(`${course}_5_lessons`);
  }

  if (completedLessons === 10 && !badges.includes(`${course}_10_lessons`)) {
    badges.push(`${course}_10_lessons`);
  }

  // UPDATE
  await updateDoc(ref, {
    [`progress.${course}.lessonsCompleted`]: arrayUnion(lessonId),
    xp: increment(xpGain),
    level: newLevel,
    streak: streak,
    badges: badges
  });

  console.log("Lesson completed");
}

// -----------------------------
// COMPLETE QUIZ
// -----------------------------
export async function completeQuiz(course, quizId) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  // SAFE INIT
  if (!data.progress[course]) {
    await updateDoc(ref, {
      [`progress.${course}`]: {
        lessonsCompleted: [],
        quizzesCompleted: []
      }
    });

    data.progress[course] = {
      lessonsCompleted: [],
      quizzesCompleted: []
    };
  }

  // prevent duplicate
  if (data.progress[course].quizzesCompleted.includes(quizId)) return;

  const xpGain = 20;

  // STREAK
  const streak = calculateStreak(data.streak);

  // XP + LEVEL
  const newXP = (data.xp || 0) + xpGain;
  const newLevel = calculateLevel(newXP);

  // UPDATE
  await updateDoc(ref, {
    [`progress.${course}.quizzesCompleted`]: arrayUnion(quizId),
    xp: increment(xpGain),
    level: newLevel,
    streak: streak
  });

  console.log("Quiz completed");
}
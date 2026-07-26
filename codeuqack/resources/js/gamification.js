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


/* =====================================================
   GET TODAY AT MIDNIGHT
===================================================== */

function getTodayMidnight() {
  const d = new Date();

  d.setHours(0, 0, 0, 0);

  return d;
}


/* =====================================================
   DAILY LOGIN STREAK
===================================================== */

function calculateStreak(oldStreak) {

  let streak = oldStreak || {
    count: 0,
    lastActive: null
  };

  const now = new Date();

  /* ---------------------------------------------
     FIRST LOGIN
  --------------------------------------------- */

  if (!streak.lastActive) {

    return {
      count: 1,
      lastActive: Timestamp.now()
    };
  }


  /* ---------------------------------------------
     GET LAST LOGIN TIME
  --------------------------------------------- */

  const lastLogin = streak.lastActive.toDate();

  const elapsedMilliseconds =
    now.getTime() - lastLogin.getTime();

  const elapsedHours =
    elapsedMilliseconds / (1000 * 60 * 60);


  /* ---------------------------------------------
     SAME DAY LOGIN
     
     User already logged in today.
     Do not increase streak.
  --------------------------------------------- */

  const today = getTodayMidnight();

  const lastLoginDay = new Date(lastLogin);

  lastLoginDay.setHours(0, 0, 0, 0);

  if (today.getTime() === lastLoginDay.getTime()) {

    return {
      count: streak.count,
      lastActive: Timestamp.now()
    };
  }


  /* ---------------------------------------------
     NEXT DAY LOGIN

     If the user comes back within 24 hours,
     continue the streak.
  --------------------------------------------- */

  if (elapsedHours < 24) {

    return {
      count: streak.count + 1,
      lastActive: Timestamp.now()
    };
  }


  /* ---------------------------------------------
     IDLE FOR 24 HOURS OR MORE

     Reset streak.
  --------------------------------------------- */

  return {
    count: 1,
    lastActive: Timestamp.now()
  };
}


/* =====================================================
   LEVEL CALCULATION
===================================================== */

function calculateLevel(xp) {

  return Math.floor(xp / 100) + 1;

}


/* =====================================================
   DAILY LOGIN STREAK UPDATE
===================================================== */

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


/* =====================================================
   COMPLETE LESSON
===================================================== */

export async function completeLesson(course, lessonId) {

  const user = auth.currentUser;

  if (!user) return;


  const ref =
    doc(db, "users", user.uid);


  const snap =
    await getDoc(ref);


  const data =
    snap.data();


  /* ---------------------------------------------
     PREVENT DUPLICATE LESSON XP
  --------------------------------------------- */

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


  /*
   * IMPORTANT:
   * Do NOT update streak here.
   *
   * Streak is maintained only by daily login.
   */


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


/* =====================================================
   COMPLETE QUIZ
===================================================== */

export async function completeQuiz(course, quizId) {

  const user = auth.currentUser;

  if (!user) return;


  const ref =
    doc(db, "users", user.uid);


  const snap =
    await getDoc(ref);


  const data =
    snap.data();


  /* ---------------------------------------------
     PREVENT DUPLICATE QUIZ XP
  --------------------------------------------- */

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


  /*
   * IMPORTANT:
   * Do NOT update streak here.
   *
   * Streak is maintained only by daily login.
   */


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
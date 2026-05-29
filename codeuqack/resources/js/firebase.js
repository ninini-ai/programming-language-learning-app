// resources/js/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpXeZO_fuYIYfnJoCihWMJDVnXe4Uefv0",
  authDomain: "codequackdb-a4bb4.firebaseapp.com",
   databaseURL: "https://codequackdb-a4bb4-default-rtdb.firebaseio.com",
  projectId: "codequackdb-a4bb4",
  messagingSenderId: "803113441027",
  appId: "1:803113441027:web:eab2eb0d9ff9463f183b36"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
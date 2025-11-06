// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1D4STj7IETG3hqOCTrKjVhehDWPCLrlE",
  authDomain: "homigo-9a1ed.firebaseapp.com",
  projectId: "homigo-9a1ed",
  storageBucket: "homigo-9a1ed.appspot.com",
  messagingSenderId: "378262189003",
  appId: "1:378262189003:web:bdace7d39b928440947c4e",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export everything directly (important for Vite + ESM)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // ✅ Fix: use direct export
export const storage = getStorage(app);

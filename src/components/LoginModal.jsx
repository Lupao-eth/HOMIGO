// src/components/LoginModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper: create or update Firestore user doc
  const upsertUserDoc = async (user, extra = {}) => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    const payload = {
      uid: user.uid,
      email: user.email || "",
      name: extra.name || user.displayName || "",
      updatedAt: serverTimestamp(),
      ...extra,
    };

    if (docSnap.exists()) {
      // Merge/update existing doc
      await setDoc(userRef, { ...docSnap.data(), ...payload }, { merge: true });
    } else {
      // Create new user doc
      await setDoc(userRef, { createdAt: serverTimestamp(), ...payload }, { merge: true });
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // clear previous cached session
      localStorage.clear();
      sessionStorage.clear();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // pull user doc and cache it
      await upsertUserDoc(user);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) localStorage.setItem("user", JSON.stringify(userSnap.data()));

      setLoading(false);
      onClose && onClose();
      onLoginSuccess && onLoginSuccess();
      navigate("/mainpage");
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/user-not-found") {
        setError("No account found with that email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to log in. Please try again later.");
      }
      console.error("Firebase login error:", err);
    }
  };

  // SIGN UP
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // clear previous cached session
      localStorage.clear();
      sessionStorage.clear();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // set displayName in Auth profile (optional)
      if (name) {
        try {
          await updateProfile(user, { displayName: name });
        } catch (pErr) {
          console.warn("Could not update displayName:", pErr);
        }
      }

      // create user doc in Firestore
      await upsertUserDoc(user, { name });

      // cache locally
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) localStorage.setItem("user", JSON.stringify(userSnap.data()));

      setLoading(false);
      setIsSignUp(false);
      setError("✅ Account created! You are now logged in.");
      onClose && onClose();
      onLoginSuccess && onLoginSuccess();
      navigate("/mainpage");
    } catch (err) {
      setLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again later.");
      }
      console.error("Firebase sign-up error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-[#12103A] text-center mb-6">
          {isSignUp ? "Create a Homigo Account" : "Login to Homigo!"}
        </h2>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12103A] outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12103A] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#12103A] outline-none"
              required
            />
          </div>

          {error && (
            <p className={`text-sm ${error.includes("created") ? "text-green-600" : "text-red-500"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#12103A] text-white py-2 rounded-xl hover:bg-[#19155C] transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (isSignUp ? "Signing up..." : "Logging in...") : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-[#12103A] font-medium hover:underline">
                Log in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-[#12103A] font-medium hover:underline">
                Sign up
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;

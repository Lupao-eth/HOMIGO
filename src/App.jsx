// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPages from "./pages/LandingPages";
import MainPage from "./pages/MainPage";
import LoginModal from "./components/LoginModal";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import Profile from "./pages/Profile";
import BookingPage from "./pages/BookingPage";
import MyTrips from "./pages/MyTrips";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import Favorites from "./pages/Favorites";
import HelpCenterPage from "./pages/HelpCenterPage";

// ✅ Component to clear data when user changes
const SessionHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // 🧹 Clear local/session data when logged out or new account logs in
        localStorage.clear();
        sessionStorage.clear();
      }
    });
    return () => unsubscribe();
  }, []);

  // This runs whenever route changes (optional)
  useEffect(() => {
    console.log("Navigated to:", location.pathname);
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      {/* ✅ Global session cleaner */}
      <SessionHandler />

      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/booking" element={<BookingPage />} /> {/* ✅ match casing */}
        <Route path="/mytrips" element={<MyTrips />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/HelpCenterPage" element={<HelpCenterPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

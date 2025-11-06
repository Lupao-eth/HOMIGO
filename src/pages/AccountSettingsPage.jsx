// src/pages/AccountSettingsPage.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaBars, FaUser } from "react-icons/fa";
import {
  User,
  MapPin,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  MessageSquareText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase-config";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    location: "",
    pets: "",
    funFact: "",
    myDreamDestination: "",
    myFavouriteArtists: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Watch auth state and load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await ensureUserDoc(user);
        await fetchUserData(user.uid);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Ensure user doc exists
  const ensureUserDoc = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email || "",
            name: user.displayName || "",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Error ensuring user doc:", err);
    }
  };

  // Fetch user data
  const fetchUserData = async (uid) => {
    try {
      setLoading(true);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserInfo((prev) => ({ ...prev, ...data }));
        if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
      } else {
        setUserInfo((prev) => ({
          ...prev,
          email: auth.currentUser?.email || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit field
  const handleEdit = async (field, label) => {
    const newValue = prompt(`Edit ${label}:`, userInfo[field] || "");
    if (newValue === null) return;
    const trimmed = newValue.trim();
    if (trimmed === "") {
      alert("Value cannot be empty.");
      return;
    }

    const updated = { ...userInfo, [field]: trimmed };
    setUserInfo(updated);

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, {
        [field]: trimmed,
        updatedAt: serverTimestamp(),
      });
      alert(`${label} updated successfully!`);
    } catch (err) {
      console.error("Error updating field:", err);
      alert("Failed to update data. Please try again.");
    }
  };

  // Change avatar
  const handleAvatarChange = async (file) => {
    if (!file || !currentUser) return;
    setUploading(true);
    try {
      const ref = storageRef(storage, `avatars/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);
      setAvatarUrl(url);
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, { avatarUrl: url, updatedAt: serverTimestamp() });
      alert("Profile photo updated.");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("Failed to upload avatar. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarButton = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (file) handleAvatarChange(file);
    };
    input.click();
  };

  // Change password
  const handleChangePassword = async () => {
    const currentPwd = prompt("Enter your current password (required to change):");
    if (!currentPwd) return;
    const newPwd = prompt("Enter your new password (min 6 chars):");
    if (!newPwd || newPwd.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      const cred = EmailAuthProvider.credential(currentUser.email, currentPwd);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, newPwd);
      alert("Password updated successfully.");
    } catch (err) {
      console.error("Password change error:", err);
      alert("Failed to change password. Check your current password and try again.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/LandingPages");
  };

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
    { icon: <MessageSquareText className="w-5 h-5" />, label: "My Reviews", path: "/reviews" },
     { icon: <MapPin className="w-5 h-5" />, label: "My Trips", path: "/mytrips" },
    { icon: <Bookmark className="w-5 h-5" />, label: "Favorites", path: "/favorites" },
    { divider: true },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help Center", path: "/help" },
    { icon: <Settings className="w-5 h-5" />, label: "Account Settings", path: "/settings" },
    { divider: true },
    { icon: <LogOut className="w-5 h-5" />, label: "Log Out", action: handleLogout },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading account info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col font-sans text-gray-800 relative">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-b border-gray-200">
        <h1
          className="text-2xl font-bold text-indigo-900 cursor-pointer hover:text-indigo-700"
          onClick={() => navigate("/mainpage")}
        >
          Homigo
        </h1>

        <div className="flex items-center gap-5">
          <div
            onClick={() => navigate("/profile")}
            className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center shadow-inner cursor-pointer hover:bg-gray-300"
          >
            <FaUser className="text-gray-700" />
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-gray-700 hover:text-indigo-700"
            >
              <FaBars />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg border border-gray-200 rounded-xl z-50">
                {menuItems.map((item, index) =>
                  item.divider ? (
                    <hr key={index} className="my-2 border-gray-200" />
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        setMenuOpen(false);
                        if (item.action) item.action();
                        else navigate(item.path);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-white border rounded-lg shadow-md mx-8 my-10 p-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Account Settings</h2>
            <p className="text-gray-600">Update your profile.</p>
            <p className="mt-2 text-indigo-800 font-medium">{currentUser?.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl text-gray-500">
                    {(userInfo.name || currentUser?.email || "U").charAt(0)}
                  </div>
                )}
              </div>
              <button
                onClick={handleAvatarButton}
                className="mt-2 bg-indigo-700 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-800"
              >
                {uploading ? "Uploading..." : "Change"}
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE FIELDS */}
        <div className="grid grid-cols-2 gap-6">
          {[
            ["name", "Name"],
            ["funFact", "Fun Fact"],
            ["pets", "Pets"],
            ["whereILive", "Where I live"],
            ["myDreamDestination", "My dream destination"],
            ["myFavouriteArtists", "My Favourite Artists"],
            ["email", "Email"],
            ["password", "Password"],
            ["contact", "Contact number"],
            ["gender", "Gender"],
          ].map(([field, label]) => {
            const displayValue =
              field === "password" ? "••••••••" : userInfo[field] || "Not set";
            return (
              <div key={field} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="text-sm text-gray-700">{label}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-600 text-sm">{displayValue}</div>
                  {field === "password" ? (
                    <FaEdit
                      onClick={handleChangePassword}
                      className="text-gray-500 cursor-pointer hover:text-indigo-700"
                    />
                  ) : (
                    <FaEdit
                      onClick={() => handleEdit(field, label)}
                      className="text-gray-500 cursor-pointer hover:text-indigo-700"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AccountSettingsPage;

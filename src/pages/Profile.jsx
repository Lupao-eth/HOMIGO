import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Menu,
  Heart,
  Home,
  Music,
  Globe2,
  MessageSquare,
  Info,
  MapPin,
  Bookmark,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react"; // ❌ Removed Handshake & CreditCard imports

const Profile = () => {
  const navigate = useNavigate();
  const [profileVisible, setProfileVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [profileInfo, setProfileInfo] = useState({
    name: "",
    funFact: "",
    pets: "",
    location: "",
    destination: "",
    artists: "",
  });

  const handleChange = (field, value) => {
    setProfileInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#ffffff] to-[#d7d8e2] relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed top-0 w-full z-50">
        <h1
          className="text-xl font-bold text-[#12103A] cursor-pointer"
          onClick={() => navigate("/mainpage")}
        >
          Homigo
        </h1>
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <User
            className="w-6 h-6 text-[#12103A] cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/profile")}
          />
          <Menu
            className="w-6 h-6 text-[#12103A] cursor-pointer hover:opacity-80 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {/* ✅ Dropdown Menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-10 w-56 bg-white shadow-lg rounded-xl border border-gray-200 py-2 z-50"
            >
              <div className="flex flex-col text-[#12103A] text-sm">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/reviews");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <MessageSquare size={16} /> My Reviews
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/MyTrips");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <MapPin size={16} /> My Trips
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/favorites");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <Bookmark size={16} /> Favorites
                </button>

                <hr className="my-2" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/help-center");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <HelpCircle size={16} /> Help Center
                </button>

                {/* ✅ Account Settings Connected */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/Settings");
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <Settings size={16} /> Account Settings
                </button>

                <hr className="my-2" />

                {/* ❌ Removed Become a host & Change Payment Method */}

                <button
                  onClick={() => {
                    navigate("/"); // ✅ Redirect to landing page
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-start justify-center mt-[120px] px-16 gap-10">
        {/* Left Section: Profile Image */}
        <div className="flex flex-col items-center text-[#12103A] w-[300px] mt-10">
          <div className="relative mb-4">
            <div className="w-52 h-52 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              <User size={120} />
            </div>
            <button className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-[#12103A] text-white rounded-full px-3 py-1.5 text-xs flex items-center hover:bg-[#1e1b5e] transition">
              <Camera size={12} className="mr-1" /> Add
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-[500px] bg-gray-300"></div>

        {/* Right Section */}
        <div className="flex flex-col text-[#12103A] w-2/3 mt-6 relative">
          {/* About Me */}
          <div>
            <h2 className="text-3xl font-bold mb-3">About Me!</h2>
            <p className="text-base text-gray-700 leading-relaxed max-w-xl">
              Hosts and guests can see your profile, and it may appear across
              Homigo to help us build trust in our community.
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-5 text-base mt-10 w-[80%]">
            {[
              { icon: <Info size={16} />, label: "Name", field: "name", placeholder: "Enter your name" },
              { icon: <MessageSquare size={16} />, label: "Fun Fact", field: "funFact", placeholder: "Share something fun about you" },
              { icon: <Heart size={16} />, label: "Pets", field: "pets", placeholder: "List your pets" },
              { icon: <Home size={16} />, label: "Where I live", field: "location", placeholder: "Your location" },
              { icon: <Globe2 size={16} />, label: "My Dream Destination", field: "destination", placeholder: "Where would you love to go?" },
              { icon: <Music size={16} />, label: "My Favourite Artists", field: "artists", placeholder: "Your favorite artists" },
            ].map(({ icon, label, field, placeholder }) => (
              <div key={field} className="flex flex-col">
                <label className="flex items-center gap-2 text-sm font-semibold mb-1">
                  {icon} {label}
                </label>
                <input
                  type="text"
                  value={profileInfo[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="border-b border-gray-400 bg-transparent focus:outline-none text-gray-700 py-1"
                />
              </div>
            ))}
          </div>

          {/* Toggle & Reviews */}
          <div className="flex justify-between items-center mt-10 w-[80%]">
            <button className="bg-white border border-gray-300 text-[#12103A] py-2 px-8 rounded-lg text-base font-medium shadow-sm hover:bg-gray-100 transition">
              Reviews I've written
            </button>

            <div className="flex items-center gap-3 text-base">
              <span className="font-medium">Enable Profile View</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileVisible}
                  onChange={() => setProfileVisible(!profileVisible)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#12103A] rounded-full peer peer-checked:bg-[#12103A] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

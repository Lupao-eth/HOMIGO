// src/pages/MainPage.jsx
// ✅ Added logic: when clicking the star icon, the item is saved in Firestore "favorites" collection per user

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import {
  User,
  Menu,
  MapPin,
  Bookmark,
  Settings,
  HelpCircle,
  LogOut,
  MessageSquareText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config"; // ✅ make sure firebase-config is set up
import { doc, setDoc, deleteDoc } from "firebase/firestore"; // ✅ firestore functions
import Footer from "../components/Footer";
import Background from "../assets/Background1.png";
import DRT from "../assets/drt.png";
import Norzagaray from "../assets/norzagaray.png";
import Angat from "../assets/angat.png";
import Meycauayan from "../assets/meycauayan.png";
import Malolos from "../assets/malolos.png";
import Pulilan from "../assets/pulilan.png";
import Search from "./Search";

const MainPage = () => {
  const [ratings, setRatings] = useState([false, false, false, false, false, false]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [activeField, setActiveField] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const suggestedPlaces = ["Hagonoy", "San Jose Del Monte", "Meycauayan", "Guiguinto", "Malolos"];

  // ✅ Firestore save/remove favorite
  const handleFavoriteToggle = async (place, index) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }

    const favoriteRef = doc(db, "users", user.uid, "favorites", place.name);

    setRatings((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });

    try {
      if (!ratings[index]) {
        // ⭐ Add to favorites
        await setDoc(favoriteRef, {
          name: place.name,
          price: place.price,
          img: place.img,
          addedAt: new Date(),
        });
      } else {
        // ❌ Remove from favorites
        await deleteDoc(favoriteRef);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleBookingClick = (place) => {
    navigate("/booking", {
      state: {
        municipality: { name: place.name, image: place.img, price: place.price },
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  const bookingData = [
    { img: DRT, name: "Dona Remedios Trinidad", price: "₱2,799 / night" },
    { img: Norzagaray, name: "Norzagaray", price: "₱2,799 / night" },
    { img: Angat, name: "Angat", price: "₱2,799 / night" },
  ];

  const guestFavorites = [
    { img: Meycauayan, name: "Meycauayan", price: "₱2,799 / night" },
    { img: Malolos, name: "Malolos", price: "₱2,799 / night" },
    { img: Pulilan, name: "Pulilan", price: "₱2,799 / night" },
  ];

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
    { icon: <MessageSquareText className="w-5 h-5" />, label: "My Reviews", path: "/reviews" },
    { icon: <MapPin className="w-5 h-5" />, label: "My Trips", path: "/MyTrips" },
    { icon: <Bookmark className="w-5 h-5" />, label: "Favorites", path: "/Favorites" },
    { divider: true },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help Center", path: "/HelpCenterPage" },
    { icon: <Settings className="w-5 h-5" />, label: "Account Settings", path: "/settings" },
    { divider: true },
    { icon: <LogOut className="w-5 h-5" />, label: "Log Out", path: "/logout" },
  ];

  return (
    <div className="min-h-[300vh] flex flex-col bg-white relative">
      {/* ✅ Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed top-0 w-full z-50">
        <h1 className="text-xl font-bold text-[#12103A]">Homigo</h1>
        <div className="flex items-center gap-4 relative">
          <User className="w-6 h-6 text-[#12103A] cursor-pointer" onClick={() => navigate("/profile")} />
          <div className="relative">
            <Menu
              className="w-6 h-6 text-[#12103A] cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden z-50">
                {menuItems.map((item, index) =>
                  item.divider ? (
                    <hr key={index} className="my-2 border-gray-200" />
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        setMenuOpen(false);
                        if (item.label === "Log Out") {
                          localStorage.clear();
                          sessionStorage.clear();
                          navigate("/");
                          return;
                        }
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition text-left ${
                        item.label === "Log Out"
                          ? "text-red-600 hover:bg-gray-100"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
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
      </nav>

      {/* 🌅 Hero Section */}
      <section
        className="relative h-[60vh] bg-center flex items-center justify-start mt-[100px] mx-[5%] rounded-[30px] overflow-hidden"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "120%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-left text-white max-w-[60%] pl-[5%]">
          <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
            Find your perfect spot <br />
            <span className="block mt-2 text-5xl">right here in Bulacan</span>
          </h1>
          <p className="mt-5 text-lg drop-shadow-md">Where Every Stay Feels Like Home</p>
        </div>
      </section>

      {/* 🔍 Search */}
      <Search
        location={location}
        setLocation={setLocation}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
        suggestedPlaces={suggestedPlaces}
        activeField={activeField}
        setActiveField={setActiveField}
      />

      {/* 🏡 Popular Bookings */}
      <section className="mt-40 px-[10%] text-center">
        <h2 className="text-4xl font-bold text-[#12103A]">Popular Bookings</h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Peaceful getaways surrounded by Bulacan's natural beauty.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {bookingData.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center cursor-pointer"
              onClick={() => handleBookingClick(item)}
            >
              <div className="relative w-full max-w-[360px] h-[420px] overflow-visible">
                <motion.img
                  src={item.img}
                  alt={item.name}
                  className="absolute left-1/2 -translate-x-1/2 rounded-[20px]"
                  style={{
                    width: "90%",
                    height: "92%",
                    objectFit: "cover",
                    top: "6%",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    zIndex: 10,
                  }}
                />
                <div
                  className="absolute left-0 right-0 bottom-0"
                  style={{
                    height: "50%",
                    background:
                      "linear-gradient(to bottom, rgba(230,235,240,0.6) 0%, rgba(170,185,200,0.55) 40%, rgba(60,80,110,0.9) 100%)",
                    borderBottomLeftRadius: "5%",
                    borderBottomRightRadius: "5%",
                    zIndex: 5,
                  }}
                />
              </div>

              {/* ⭐ Favorite */}
              <div className="mt-4 px-2 flex justify-between items-center w-full max-w-[360px]">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#0a073c]">{item.name}</h3>
                  <p className="text-sm text-[#0a073c]">{item.price}</p>
                </div>
                <FaStar
                  size={18}
                  className={`cursor-pointer transition ${
                    ratings[index] ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(item, index);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💖 Guests Favorite */}
      <section className="mt-28 px-[10%] text-center">
        <h2 className="text-4xl font-bold text-[#12103A]">Guests Favorite</h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Loved by guests for their cozy vibes and great stays.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {guestFavorites.map((item, index) => (
            <motion.div
              key={index + bookingData.length}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center cursor-pointer"
              onClick={() => handleBookingClick(item)}
            >
              <div className="relative w-full max-w-[360px] h-[420px] overflow-visible">
                <motion.img
                  src={item.img}
                  alt={item.name}
                  className="absolute left-1/2 -translate-x-1/2 rounded-[20px]"
                  style={{
                    width: "90%",
                    height: "92%",
                    objectFit: "cover",
                    top: "6%",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    zIndex: 10,
                  }}
                />
                <div
                  className="absolute left-0 right-0 bottom-0"
                  style={{
                    height: "50%",
                    background:
                      "linear-gradient(to bottom, rgba(230,235,240,0.6) 0%, rgba(170,185,200,0.55) 40%, rgba(60,80,110,0.9) 100%)",
                    borderBottomLeftRadius: "5%",
                    borderBottomRightRadius: "5%",
                    zIndex: 5,
                  }}
                />
              </div>
              <div className="mt-4 px-2 flex justify-between items-center w-full max-w-[360px]">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-[#0a073c]">{item.name}</h3>
                  <p className="text-sm text-[#0a073c]">{item.price}</p>
                </div>
                <FaStar
                  size={18}
                  className={`cursor-pointer transition ${
                    ratings[index + bookingData.length]
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(item, index + bookingData.length);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="flex-1 bg-gray-50 px-[20%] py-12"></div>
      <Footer />
    </div>
  );
};

export default MainPage;

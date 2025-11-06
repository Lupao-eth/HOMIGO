import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../assets/Background1.png";
import DRT from "../assets/drt.png";
import Norzagaray from "../assets/norzagaray.png";
import Angat from "../assets/angat.png";
import Meycauayan from "../assets/meycauayan.png";
import Malolos from "../assets/malolos.png";
import Pulilan from "../assets/pulilan.png";
import Search from "./Search";
import LoginModal from "../components/LoginModal"; // ✅ Import your login modal

const LandingPages = () => {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([false, false, false, false, false, false]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [activeField, setActiveField] = useState("");

  // ✅ For login modal
  const [showLogin, setShowLogin] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);

  const suggestedPlaces = ["Hagonoy", "San Jose Del Monte", "Meycauayan", "Guiguinto", "Malolos"];

  const toggleStar = (cardIndex) => {
    setRatings((prev) => {
      const copy = [...prev];
      copy[cardIndex] = !copy[cardIndex];
      return copy;
    });
  };

  const handleSelectPlace = (place) => setLocation(place);

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

  // ✅ When user clicks a picture
  const handleCardClick = (placeName) => {
    setPendingDestination(placeName); // store the destination name
    setShowLogin(true); // show the login modal
  };

  // ✅ Called after successful login (inside modal)
  const handleLoginSuccess = () => {

    setShowLogin(false);
    if (pendingDestination) {
      navigate(`/destination/${pendingDestination}`);
      setPendingDestination(null);
    }
  };

  return (
    <div className="min-h-[300vh] flex flex-col">
      <Navbar />

      {/* 🌅 Hero Section */}
      <section
        className="relative h-[60vh] bg-center flex items-center justify-start mt-[10%] mx-[5%] rounded-[30px] overflow-hidden"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "120%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-left text-white max-w-[60%] pl-[5%]">
          <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
            Find your perfect spot
            <br />
            <span className="block mt-2 text-5xl">right here in Bulacan</span>
          </h1>
          <p className="mt-5 text-lg drop-shadow-md">
            Where Every Stay Feels Like Home
          </p>
        </div>
      </section>

      {/* 🔍 Search Component */}
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
        handleSelectPlace={handleSelectPlace}
        activeField={activeField}
        setActiveField={setActiveField}
      />

      {/* 🏡 Popular Bookings Section */}
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
              onClick={() => handleCardClick(item.name)} // ✅ Show login modal when clicked
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
                  <h3 className="text-lg font-semibold text-[#0a073c]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#0a073c]">{item.price}</p>
                </div>
                <FaStar
                  size={18}
                  className={`cursor-pointer transition ${
                    ratings[index] ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(index);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💖 Guests Favorite Section */}
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
              onClick={() => handleCardClick(item.name)} // ✅ Show login modal here too
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
                  <h3 className="text-lg font-semibold text-[#0a073c]">
                    {item.name}
                  </h3>
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
                    toggleStar(index + bookingData.length);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {}}
          onLoginSuccess={handleLoginSuccess} // handle redirect
        />
      )}

      <div className="flex-1 bg-gray-50 px-[20%] py-12"></div>
      <Footer />
    </div>
  );
};

export default LandingPages;

// src/components/Search.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import Rectangle from "../assets/rectangle.png";

// ✅ Import Firestore
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Search = ({
  location,
  setLocation,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  suggestedPlaces,
  handleSelectPlace = () => {},
  activeField,
  setActiveField,
  setShowLogin,
}) => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const suggestionRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ Firestore municipalities
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "municipalities"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMunicipalities(data);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    };

    fetchMunicipalities();
  }, []);

  // ✅ Combine local + Firestore suggestions
  const combinedSuggestions = [
    ...suggestedPlaces,
    ...municipalities.map((m) => m.name),
  ];

  const filteredSuggestions = combinedSuggestions.filter((place) =>
    place.toLowerCase().includes(location.toLowerCase())
  );

  // ✅ Handle clicks outside suggestion box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle search button click (FIXED)
  const handleSearch = () => {
    // 1️⃣ Require all fields before allowing redirect
    if (!location || !checkIn || !checkOut || !guests) {
      alert("Please fill in all fields before searching.");
      return;
    }

    const matched =
      municipalities.find(
        (m) => m.name.toLowerCase() === location.toLowerCase()
      ) ||
      suggestedPlaces.find(
        (p) => p.toLowerCase() === location.toLowerCase()
      );

    const currentPath = routerLocation.pathname;

    // 2️⃣ If Landing Page (not logged in) → open login modal
    if (currentPath === "/") {
      if (setShowLogin) setShowLogin(true);
      return;
    }

    // 3️⃣ If Main Page (logged in) → navigate to BookingPage
    if (currentPath === "/MainPage") {
      if (matched) {
        navigate("/booking", {
          state: { municipality: matched, checkIn, checkOut, guests },
        });
      } else {
        // Still allow navigation even if no match (for testing)
        navigate("/booking", {
          state: { location, checkIn, checkOut, guests },
        });
      }
    }
  };

  // ✅ Handle suggestion click
  const handlePlaceClick = (place) => {
    setLocation(place);
    handleSelectPlace(place);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full flex justify-center z-10">
      <div
        ref={suggestionRef}
        className="absolute bottom-[-6rem] w-3/4 rounded-[30px] shadow-lg flex items-center justify-between px-8 py-10 bg-center bg-no-repeat backdrop-blur-sm overflow-visible"
        style={{
          backgroundImage: `url(${Rectangle})`,
          backgroundSize: "130%",
        }}
      >
        {/* LOCATION INPUT */}
        <div
          className={`flex flex-col flex-1 items-center text-center px-3 py-2 relative transition-all duration-300 ${
            activeField === "location"
              ? "bg-white/70 rounded-[20px] scale-[1.05]"
              : ""
          }`}
        >
          <label className="font-semibold text-gray-800 text-lg">
            Where are you going?
          </label>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => {
              setShowSuggestions(true);
              setActiveField("location");
            }}
            className="border-b border-gray-400 w-full mt-1 text-center text-sm text-gray-700 focus:outline-none bg-transparent placeholder-gray-500"
          />

          {/* ✅ Suggestion dropdown */}
          <AnimatePresence>
            {showSuggestions && location && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute top-20 w-56 bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden z-[999]"
              >
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="font-semibold text-gray-700 text-sm">
                    Suggested Destinations
                  </p>
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((place) => (
                      <li
                        key={place}
                        onMouseDown={() => handlePlaceClick(place)}
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-indigo-100 cursor-pointer transition-all"
                      >
                        <FaMapMarkerAlt className="text-indigo-500" />
                        <span>{place}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-500 text-sm">
                      No matches found
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-10 bg-gray-400 mx-4" />

        {/* CHECK IN */}
        <div
          className={`flex flex-col flex-1 items-center text-center px-3 py-2 relative transition-all duration-300 ${
            activeField === "checkin"
              ? "bg-white/70 rounded-[20px] scale-[1.05]"
              : ""
          }`}
        >
          <label className="font-semibold text-gray-800 text-lg">Check in</label>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="mm/dd/yyyy"
            className="border-b border-gray-400 w-full mt-1 text-center text-sm text-gray-700 focus:outline-none bg-transparent"
          />
        </div>

        {/* CHECK OUT */}
        <div
          className={`flex flex-col flex-1 items-center text-center px-3 py-2 relative transition-all duration-300 ${
            activeField === "checkout"
              ? "bg-white/70 rounded-[20px] scale-[1.05]"
              : ""
          }`}
        >
          <label className="font-semibold text-gray-800 text-lg">Check out</label>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="mm/dd/yyyy"
            className="border-b border-gray-400 w-full mt-1 text-center text-sm text-gray-700 focus:outline-none bg-transparent"
          />
        </div>

        <div className="w-px h-10 bg-gray-400 mx-4" />

        {/* GUESTS */}
        <div
          className={`flex flex-col flex-1 items-center text-center px-3 py-2 relative transition-all duration-300 ${
            activeField === "guests"
              ? "bg-white/70 rounded-[20px] scale-[1.05]"
              : ""
          }`}
        >
          <label className="font-semibold text-gray-800 text-lg">Add Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="border-b border-gray-400 w-full mt-1 text-center text-sm text-gray-700 focus:outline-none bg-transparent"
          />
        </div>

        {/* ✅ SEARCH BUTTON (fixed working) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-4 bg-[#0a073ccd] text-white p-4 rounded-full hover:bg-[#0a073c] transition shadow-md"
          onClick={handleSearch}
        >
          <FiSearch size={22} />
        </motion.button>
      </div>
    </div>
  );
};

export default Search;

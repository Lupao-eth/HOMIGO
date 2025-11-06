// src/pages/BookingPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaUtensils,
  FaConciergeBell,
  FaMapMarkerAlt,
  FaBars,
  FaUser,
  FaStar,
  FaBookmark,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { db, auth } from "../firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import axios from "axios";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { municipality, checkIn, checkOut, guests } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // GCash modal states
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  if (!municipality) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
        ⚠️ No location selected. Please go back and search again.
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReserve = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("⚠️ Please log in to book a room.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        municipality: municipality?.name || municipality,
        address: "Camella Example Address, Bulacan",
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        guests: guests || 1,
        price: 2799,
        nights: 2,
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        status: "Pending Payment",
        createdAt: Timestamp.now(),
        userId: user.uid,
      };

      // Save booking to Firestore
      await addDoc(collection(db, "users", user.uid, "bookings"), bookingData);
      setSuccess(true);

      // Call GCash API
      const response = await axios.post(
        "https://homigo-phc4oi3qb-poshis-projects-f8227a07.vercel.app/api/gcash",
        {
          amount: 2799,
          description: `Booking at ${municipality?.name || municipality} by ${user.email}`,
        }
      );

      // ✅ Expect `link` from serverless function
      const { link } = response.data;
      if (link) {
        setPaymentLink(link);
        setShowGCashModal(true);
      } else {
        alert("Payment link not found. Please try again later.");
      }
    } catch (error) {
      console.error("Error during booking/payment:", error);
      alert("❌ There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate("/MainPage");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 relative">
        <h1
          onClick={handleGoHome}
          className="text-3xl font-bold text-[#0a073c] cursor-pointer hover:text-[#1a155c] transition"
        >
          Homigo
        </h1>

        {/* MENU DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center bg-[#0a073c] text-white px-5 py-2 rounded-full hover:bg-[#1a155c] transition"
          >
            <FaBars className="mr-2" /> Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl border p-3 space-y-2 z-50">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={() => navigate("/myreviews")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <FaStar /> My Reviews
              </button>
              <button
                onClick={() => navigate("/favorites")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <FaBookmark /> Favorites
              </button>
              <button
                onClick={() => navigate("/helpcenter")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <FaQuestionCircle /> Help Center
              </button>
              <button
                onClick={() => navigate("/Settings")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <FaCog /> Account Settings
              </button>
              <button
                onClick={() => navigate("/logout")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600"
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" className="rounded-xl object-cover w-full h-48" />
            <img src="https://images.unsplash.com/photo-1600585154161-1062bf7f05d0" className="rounded-xl object-cover w-full h-48" />
            <img src="https://images.unsplash.com/photo-1600585154315-92c4a608ec60" className="rounded-xl object-cover w-full h-48" />
            <img src="https://images.unsplash.com/photo-1600585154141-0c8e4c0f1c38" className="rounded-xl object-cover w-full h-48" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Result based on your search</h2>
            <p className="text-gray-700">
              Here are the available stays in{" "}
              <span className="font-bold text-[#0a073c]">
                {municipality?.name || municipality}
              </span>
            </p>
          </div>

          {/* PLACE DETAILS */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-2">Brand New Spacious Studio Unit at the Spire</h3>
            <p className="text-gray-700 mb-4">
              Enjoy a relaxing stay in {municipality?.name || municipality} with modern amenities.
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-gray-700">
              <span className="flex items-center gap-2"><FaWifi /> WiFi</span>
              <span className="flex items-center gap-2"><FaTv /> Television</span>
              <span className="flex items-center gap-2"><FaSnowflake /> Air Conditioning</span>
              <span className="flex items-center gap-2"><FaUtensils /> Kitchen</span>
              <span className="flex items-center gap-2"><FaConciergeBell /> 24/7 Assistance</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#0a073c] mb-2">{municipality?.name || municipality}</h3>

            <div className="flex items-center text-gray-600 mb-3">
              <FaMapMarkerAlt className="mr-2" />
              <span>Camella Example Address, Bulacan</span>
            </div>

            <p className="text-lg font-semibold mb-4">
              ₱2,799 <span className="text-sm text-gray-600">/ 2 nights</span>
            </p>

            <div className="border rounded-xl p-4 mb-4">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-gray-600 text-sm">CHECK-IN</p>
                  <p className="font-semibold">{formatDate(checkIn)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">CHECK-OUT</p>
                  <p className="font-semibold">{formatDate(checkOut)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">GUESTS</p>
                  <p className="font-semibold">{guests}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleReserve}
              disabled={isLoading}
              className="w-full bg-[#0a073c] text-white py-3 rounded-xl hover:bg-[#1a155c] transition font-semibold disabled:opacity-50"
            >
              {isLoading ? "Processing..." : success ? "Redirecting..." : "RESERVE"}
            </button>

            {success && (
              <p className="text-center text-green-600 font-medium mt-3">
                ✅ Booking saved! Proceed to GCash...
              </p>
            )}

            <p className="text-center text-gray-500 text-sm mt-2">You won’t be charged yet</p>
          </div>
        </div>
      </div>

      {/* GCash Modal */}
      {showGCashModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-3 text-[#0a073c]">GCash Payment</h2>
            <p className="text-gray-600 mb-4">Scan QR or click Pay button</p>

            <div className="w-40 h-40 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">GCash QR Here</span>
            </div>

            <button
              onClick={() => (window.location.href = paymentLink)}
              className="w-full bg-[#0a073c] text-white py-2 rounded-xl mb-2 font-semibold hover:bg-[#1a155c] transition"
            >
              Pay with GCash
            </button>

            <button
              onClick={() => setShowGCashModal(false)}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

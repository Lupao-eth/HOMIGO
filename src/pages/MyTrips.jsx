// src/pages/MyTrips.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import {
  FaMapMarkerAlt,
  FaUserCircle,
  FaStar,
  FaBookmark,
  FaQuestionCircle,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch only the bookings of the current logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        alert("⚠️ Please log in to view your trips.");
        navigate("/login");
        return;
      }

      try {
        const userBookingsRef = collection(db, "users", user.uid, "bookings");
        const q = query(userBookingsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkIn: data.checkIn?.toDate
              ? data.checkIn.toDate()
              : new Date(data.checkIn),
            checkOut: data.checkOut?.toDate
              ? data.checkOut.toDate()
              : new Date(data.checkOut),
          };
        });

        setBookings(fetched);
      } catch (error) {
        console.error("🔥 Error fetching user bookings:", error);
        alert("Failed to load your trips. Please check Firestore setup.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 p-6 relative">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1
          onClick={() => navigate("/MainPage")}
          className="text-3xl font-bold text-[#0a073c] cursor-pointer"
        >
          Homigo
        </h1>
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-[#0a073c]"
          >
            <FaUserCircle size={28} />
          </button>

          {/* ☰ MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300"
          >
            ☰
          </button>

          {/* ✅ DROPDOWN MENU */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-56 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-50 animate-fade-in">
              <h3 className="text-sm text-gray-500 mb-2 ml-1">Menu</h3>
              <MenuItem icon={<FaUserCircle />} label="Profile" onClick={() => navigate("/profile")} />
              <MenuItem icon={<FaClipboardList />} label="My Reviews" onClick={() => navigate("/reviews")} />
              <MenuItem icon={<FaStar />} label="My Trips" onClick={() => navigate("/MyTrips")} />
              <MenuItem icon={<FaBookmark />} label="Favorites" onClick={() => navigate("/favorites")} />
              <hr className="my-2" />
              <MenuItem icon={<FaQuestionCircle />} label="Help Center" onClick={() => navigate("/help")} />
              <MenuItem icon={<FaCog />} label="Account Settings" onClick={() => navigate("/Settings")} />
              <hr className="my-2" />
              <MenuItem
                icon={<FaSignOutAlt />}
                label="Log Out"
                onClick={async () => {
                  await auth.signOut();
                  alert("You have logged out.");
                  navigate("/LandingPages");
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* TITLE */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-1">My Trips</h2>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          View all your booked staycations in one place.
        </p>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading trips...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No bookings found yet. Try reserving a stay!
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {bookings.map((b) => (
            <TripCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Menu Item Component
const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 text-gray-800 transition"
  >
    <span className="text-gray-600">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

// ✅ Trip Card Component
const TripCard = ({ booking }) => (
  <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-xl mb-3">
    <div className="flex items-center gap-4">
      <img
        src={
          booking.imageUrl ||
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        }
        alt="trip"
        className="w-20 h-20 rounded-lg object-cover"
      />
      <div>
        <h4 className="font-bold text-[#0a073c]">
          {booking.municipality || "Unknown Location"}
        </h4>
        <p className="text-gray-600 text-sm">
          ₱{booking.price || "0"} for {booking.guests || 1} guest(s)
        </p>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <FaMapMarkerAlt size={12} /> {booking.address || "No address"}
        </p>
        <p className="text-sm mt-1">
          {booking.checkIn && booking.checkOut
            ? `${booking.checkIn.toLocaleDateString("en-GB")} - ${booking.checkOut.toLocaleDateString("en-GB")}`
            : "No dates"}
        </p>
      </div>
    </div>
    <HiOutlineArrowRight size={28} className="text-gray-600 cursor-pointer" />
  </div>
);

export default MyTrips;

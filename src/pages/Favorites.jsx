// src/pages/Favorites.jsx
// Displays all favorited places of the logged-in user

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Footer from "../components/Footer";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to view your favorites.");
      navigate("/");
      return;
    }

    const favoritesRef = collection(db, "users", user.uid, "favorites");

    // ✅ Real-time listener for favorites
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const favList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favList);
    });

    return () => unsubscribe();
  }, [navigate]);

  const removeFavorite = async (favId) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", favId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleBookingClick = (item) => {
    navigate("/booking", {
      state: {
        municipality: { name: item.name, image: item.img, price: item.price },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed top-0 w-full z-50">
        <h1
          className="text-xl font-bold text-[#12103A] cursor-pointer"
          onClick={() => navigate("/mainpage")}
        >
          Homigo
        </h1>
      </nav>

      <div className="mt-[120px] px-[10%] text-center flex-1">
        <h2 className="text-4xl font-bold text-[#12103A] mb-3">Your Favorites</h2>
        <p className="text-gray-600 mb-10">
          Places you’ve added to your favorites list.
        </p>

        {favorites.length === 0 ? (
          <p className="text-gray-500 mt-10">You haven’t added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {favorites.map((item) => (
              <motion.div
                key={item.id}
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

                {/* ⭐ Remove from favorites */}
                <div className="mt-4 px-2 flex justify-between items-center w-full max-w-[360px]">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-[#0a073c]">{item.name}</h3>
                    <p className="text-sm text-[#0a073c]">{item.price}</p>
                  </div>
                  <FaStar
                    size={18}
                    className="text-yellow-400 cursor-pointer transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(item.id);
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;

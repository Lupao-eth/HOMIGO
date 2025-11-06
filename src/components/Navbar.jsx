import React, { useState } from "react";
import LoginModal from "../components/LoginModal";
import SignUpModal from "../components/SignupModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleCloseSignUp = () => setShowSignUp(false);

  const handleContactClick = () => console.log("Contact us clicked");

  return (
    <>
      {/* 🧭 Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 🏠 Logo */}
            <div className="text-2xl font-bold text-[#0a073ccd]">Homigo</div>

            {/* 💻 Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleLoginClick}
                className="font-semibold text-lg hover:opacity-80"
              >
                Login
              </button>
              <button
                onClick={handleContactClick}
                className="font-semibold text-lg hover:opacity-80"
              >
                Contact Us
              </button>
            </div>

            {/* 📱 Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 focus:outline-none text-2xl"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* 📋 Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <button
              onClick={handleLoginClick}
              className="block w-full text-left px-4 py-3 font-semibold text-lg hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={handleContactClick}
              className="block w-full text-left px-4 py-3 font-semibold text-lg hover:bg-gray-100"
            >
              Contact Us
            </button>
          </div>
        )}
      </nav>

      {/* 🔐 Modals */}
      {showLogin && (
        <LoginModal
          onClose={handleCloseLogin}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}

      {showSignUp && (
        <SignUpModal
          onClose={handleCloseSignUp}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;

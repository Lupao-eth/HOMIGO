import React from "react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Book Your Perfect Stay Effortlessly 🏨
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Discover amazing places and book rooms in just a few clicks with our seamless booking platform.
      </p>
      <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
        Get Started
      </button>
    </section>
  );
};

export default Hero;

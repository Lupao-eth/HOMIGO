import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Homigo</h2>
        <p className="text-gray-400 mb-4">
          Experience the heart of Bulacan — one stay at a time.
        </p>

        

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Homigo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

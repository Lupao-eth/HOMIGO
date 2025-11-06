import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaQuestionCircle, FaEnvelope, FaUser } from "react-icons/fa";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const HelpCenterPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const faqs = [
    {
      question: "How do I book a stay on Homigo?",
      answer:
        "Simply search for your desired location, select your stay, and click 'Reserve'. You can confirm your booking by logging in.",
    },
    {
      question: "How can I become a host?",
      answer:
        "Go to 'Become a Host' in the menu and fill out the required details. Our admin will review your application.",
    },
    {
      question: "Where can I view my bookings?",
      answer:
        "Your bookings can be found under the 'My Trips' section in the menu.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can fill out the form below, and our support team will get back to you as soon as possible.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "helpRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error submitting help request:", err);
      alert("❌ Failed to send. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1
          onClick={() => navigate("/mainpage")}
          className="text-2xl font-bold text-indigo-900 cursor-pointer hover:text-indigo-700"
        >
          Homigo
        </h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center bg-indigo-900 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            <FaBars className="mr-2" /> Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-xl border z-50">
              {[
                { label: "Profile", path: "/profile" },
                { label: "My Reviews", path: "/reviews" },
                { label: "My Trips", path: "/mytrips" },
                { label: "Favorites", path: "/favorites" },
                { label: "Help Center", path: "/help" },
                { label: "Account Settings", path: "/settings" },
                { label: "Become a Host", path: "/becomehost" },
                { label: "Log Out", path: "/logout" },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.path);
                  }}
                  className="block w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
          <FaQuestionCircle /> Help Center
        </h2>

        {/* FAQ Section */}
        <section className="space-y-4 mb-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-xl p-4 cursor-pointer border hover:border-indigo-500 transition"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-semibold text-lg flex justify-between items-center">
                {faq.question}
                <span>{expanded === index ? "−" : "+"}</span>
              </h3>
              {expanded === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </section>

        {/* Contact Form */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
            Need more help?
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-900 text-white py-2 rounded-lg hover:bg-indigo-800 transition disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
            {success && (
              <p className="text-green-600 text-center mt-3">
                ✅ Message sent! We'll get back to you soon.
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default HelpCenterPage;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaBuilding,
  FaChartLine,
  FaLock,
  FaCogs,
  FaUsers,
  FaSignInAlt,
  FaComments,
  FaTimes,
} from "react-icons/fa";

const features = [
  {
    title: "Automated Billing",
    desc: "Generate invoices instantly with automation and accuracy.",
    icon: <FaBuilding className="text-[#FFD700] text-3xl" />,
  },
  {
    title: "ERP Integration",
    desc: "Seamless integration with enterprise systems.",
    icon: <FaCogs className="text-[#FFD700] text-3xl" />,
  },
  {
    title: "Secure Payments",
    desc: "Trusted, encrypted transactions with multiple modes.",
    icon: <FaLock className="text-[#FFD700] text-3xl" />,
  },
  {
    title: "Real-time Analytics",
    desc: "Insights that empower smarter business decisions.",
    icon: <FaChartLine className="text-[#FFD700] text-3xl" />,
  },
  {
    title: "24x7 Support",
    desc: "Round-the-clock customer success team.",
    icon: <FaUsers className="text-[#FFD700] text-3xl" />,
  },
];

const clients = [
  "https://t3.ftcdn.net/jpg/03/91/89/84/360_F_391898485_QPJhJT5WJVLFOAplGXmZWKFbyHW9VAdm.jpg",
  "https://t3.ftcdn.net/jpg/03/91/89/84/360_F_391898485_QPJhJT5WJVLFOAplGXmZWKFbyHW9VAdm.jpg",
  "https://t3.ftcdn.net/jpg/03/91/89/84/360_F_391898485_QPJhJT5WJVLFOAplGXmZWKFbyHW9VAdm.jpg",
  "https://t3.ftcdn.net/jpg/03/91/89/84/360_F_391898485_QPJhJT5WJVLFOAplGXmZWKFbyHW9VAdm.jpg",
];

const LandingPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="bg-[#0B0C10] text-[#F9F9F9] font-sans relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 sticky top-0 z-50 bg-[#1F1F1F] shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3">
         <a href="/">
           <img
            src="./icon.png"
            alt="FlashRent Logo"
            className="w-27 h-9 border-amber-300 border-2 rounded-md object-fit"
          />
         </a>
          {/* <span className="hidden md:inline text-2xl font-bold text-[#FFD700]">
            FlashRent
          </span> */}
        </div>

        {/* Contact Details */}
        <div className="hidden md:flex gap-6 items-center">
          <div className="flex items-center gap-2 bg-[#0B0C10] px-3 py-1 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700] transition">
            <FaPhone className="text-[#FFD700]" />
            <a
              href="tel:+919337815591"
              className="text-sm text-gray-300 hover:text-[#FFD700]"
            >
              +91 9337815591
            </a>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0C10] px-3 py-1 rounded-lg border border-[#FFD700]/40 hover:border-[#FFD700] transition">
            <FaEnvelope className="text-[#FFD700]" />
            <a
              href="mailto:flashrent.hp@gmail.com"
              className="text-sm text-gray-300 hover:text-[#FFD700]"
            >
              flashrent.hp@gmail.com
            </a>
          </div>
        </div>

        {/* ERP Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
        >
          <FaSignInAlt /> ERP
        </button>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/modern-office-building-background-with-golden-light_839035-337933.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFD700] drop-shadow-lg">
            Rent Smarter, Work Faster
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            FlashRent Commercial offers premium rental management, automated
            billing, ERP integration, and analytics trusted by leading
            enterprises.
          </p>
          <button className="mt-6 bg-[#FFD700] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Get Started
          </button>
        </motion.div>
      </section>

      {/* Owner Message */}
      <section className="py-16 px-6 md:px-20 bg-[#1F1F1F]" id="about">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src="./owner.jpeg"
            alt="Owner"
            className="w-52  h-52 rounded-full border-4 border-[#FFD700] object-cover"
            data-aos="fade-right"
          />
          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold text-[#FFD700] flex items-center gap-3">
              <FaUserTie /> A Word from Our Founder
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              “At FlashRent Commercial, we aim to redefine the rental industry
              with technology-driven solutions. Our system empowers businesses
              with smart billing, analytics, and seamless operations — giving
              owners peace of mind and clients the best experience possible.”
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-20" id="features">
        <h2
          className="text-4xl font-bold text-center text-[#FFD700]"
          data-aos="fade-up"
        >
          Why Choose FlashRent?
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg border border-[#FFD700]/20"
              data-aos="zoom-in"
            >
              <div>{f.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-[#FFD700]">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 px-6 md:px-20 bg-[#1F1F1F]">
        <h2
          className="text-3xl font-bold text-center text-[#FFD700]"
          data-aos="fade-up"
        >
          Trusted by Leading Brands
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {clients.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="client"
              className="h-16 max-w-full object-contain grayscale hover:grayscale-0 transition"
              data-aos="zoom-in"
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 md:px-20" id="contact">
        <h2
          className="text-3xl font-bold text-center text-[#FFD700]"
          data-aos="fade-up"
        >
          Contact Us
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Form */}
          <form
            className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg space-y-4"
            data-aos="fade-right"
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded bg-[#0B0C10] border border-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded bg-[#0B0C10] border border-gray-700 text-white"
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded bg-[#0B0C10] border border-gray-700 text-white h-32"
            ></textarea>
            <button className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg shadow hover:bg-yellow-400 transition">
              Send Message
            </button>
          </form>

          {/* Map + Contact Info */}
          <div className="space-y-6" data-aos="fade-left">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.3280531369396!2d83.58630582690245!3d21.3375517270665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a26b5a6f66d5d85%3A0xbe639ac45589565c!2sShree%20Traders%20haldipali%20chowk%20Bargarh%20Odisha!5e0!3m2!1sen!2sin!4v1756326889810!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 rounded-lg"
              style={{ border: 0 }}
            ></iframe>

            <div className="flex items-center gap-3">
              <FaPhone className="text-[#FFD700]" />
              <a href="tel:+919337815591" className="hover:text-[#FFD700]">
                +91 9337815591
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[#FFD700]" />
              <a
                href="mailto:contact@flashrent.com"
                className="hover:text-[#FFD700]"
              >
                contact@flashrent.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-[#FFD700] text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition flex items-center justify-center"
          >
            <FaComments className="text-2xl" />
          </button>
        ) : (
          <div className="bg-[#1F1F1F] w-full max-w-xs sm:max-w-sm rounded-2xl shadow-2xl border border-[#FFD700]/40 fixed bottom-6 right-6">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-[#FFD700]">
                Need Help?
              </h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-red-400"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-300">
                Hi 👋 I'm FlashRent Assistant. How can I help you today?
              </p>
              <a
                href="tel:+919337815591"
                className="flex items-center gap-3 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-medium"
              >
                <FaPhone /> Call Us
              </a>
              <a
                href="mailto:flashrent.hp@gmail.com"
                className="flex items-center gap-3 bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-medium"
              >
                <FaEnvelope /> Email Us
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1F1F1F] py-6 text-center border-t border-gray-700 px-2">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} FlashRent Commercial. All rights
          reserved.
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-gray-500 flex-wrap">
          <span>Designed & Developed by</span>
          <img
            src="https://res.cloudinary.com/codebysidd/image/upload/v1738268286/PrevQue/jgk5449dtlwoi7rjecxc.png"
            alt="OdishaTech"
            className="w-6 object-contain"
          />
          <a
            href="https://otss.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FFD700]"
          >
            OdishaTech Software Solutions
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

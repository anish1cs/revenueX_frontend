import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSync,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import domain from "../constants";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  // Generate random captcha text
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  // Draw captcha on canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);

    // Draw text with distortion
    ctx.font = "bold 28px Verdana";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const x = 30 + i * 25;
      const y = height / 2 + (Math.random() * 10 - 5);
      const angle = Math.random() * 0.5 - 0.25;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `rgb(${50 + Math.random() * 150}, ${
        50 + Math.random() * 150
      }, ${50 + Math.random() * 150})`;
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Generate new captcha
  const generateCaptcha = () => {
    const newCaptcha = generateCaptchaText();
    setCaptcha(newCaptcha);
    setUserCaptcha("");
    drawCaptcha(newCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userCaptcha.trim().toUpperCase() !== captcha) {
      setError("Captcha does not match. Please try again.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${domain}/users/login`, {
        email: username,
        password,
      });
      login(res.data.data.accessToken, res.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white border-r">
        <div className="max-w-md text-center px-6">
          <img
            src="https://img.icons8.com/ios-filled/100/1e40af/combo-chart.png"
            alt="RevenuX Logo"
            className="mx-auto w-20 h-20 mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">FlashRent</h1>
          <p className="text-gray-600 text-lg mb-4">
            Smart billing. Clear insights. Faster decisions.
          </p>
          <p className="text-gray-500 mb-3">
            FlashRent empowers your business with seamless billing, effortless
            customer management, and real-time revenue tracking.
          </p>
          <p className="text-gray-500 mb-3">
            Whether you’re handling 50 invoices or 5,000, FlashRent ensures your
            data stays secure and accessible — giving you the confidence to make
            the right decisions, at the right time.
          </p>
          <p className="text-gray-500">
            Trusted by retailers and enterprises alike, FlashRent isn’t just a
            billing system — it’s your growth partner in the digital age.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-10">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Enter the text shown below:
              </label>
              <div className="flex items-center justify-between mb-3">
                <canvas
                  ref={canvasRef}
                  width="180"
                  height="50"
                  className="border rounded-lg"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="ml-3 text-blue-600 hover:text-blue-800"
                >
                  <FaSync />
                </button>
              </div>
              <input
                type="text"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                placeholder="Type captcha here"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Extras */}
          <div className="mt-6 flex justify-between text-sm text-gray-600">
            <a href="#" className="hover:underline hover:text-blue-700">
              Forgot password?
            </a>
            <a
              href="#"
              className="font-medium text-blue-700 hover:text-blue-800 hover:underline"
            >
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

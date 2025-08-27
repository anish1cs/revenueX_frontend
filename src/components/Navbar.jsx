import React, { useState, useContext, useEffect } from "react";
import { FaBell, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Payment received from Retailer A" },
    { id: 2, message: "New order placed by Retailer B" },
  ]);

  const { user, logout } = useContext(AuthContext);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let greet = "Welcome";
    if (hour < 12) greet = "☀️ Good Morning";
    else if (hour < 18) greet = "🌤️ Good Afternoon";
    else greet = "🌙 Good Evening";

    setGreeting(`${greet}, ${user?.fullname || "Admin"}!`);
  }, [user]);

  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      {/* Greeting / Dynamic Message */}
      <h2 className="text-lg font-semibold text-gray-800">{greeting}</h2>

      {/* Right side */}
      <div className="flex items-center gap-6 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() =>
              setDropdownOpen(dropdownOpen === "notifications" ? false : "notifications")
            }
            className="relative"
          >
            <FaBell className="w-6 h-6 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>
          {dropdownOpen === "notifications" && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
              <h3 className="px-4 py-2 font-semibold text-gray-700 border-b">
                Notifications
              </h3>
              <ul>
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    {note.message}
                  </li>
                ))}
              </ul>
              {notifications.length === 0 && (
                <p className="px-4 py-2 text-gray-500 text-sm">No new notifications</p>
              )}
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setDropdownOpen(dropdownOpen === "profile" ? false : "profile")
            }
            className="flex items-center gap-2"
          >
            <img
              src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"}
              alt="Admin"
              className="w-10 h-10 rounded-full border"
            />
          </button>
          {dropdownOpen === "profile" && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="flex items-center gap-3 px-4 py-3 border-b">
                <FaUserCircle className="text-gray-700 text-2xl" />
                <div>
                  <p className="font-medium text-gray-800">{user?.fullname || "Admin"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "admin@example.com"}</p>
                </div>
              </div>
              <ul>
                <li className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                  <FaCog /> Settings
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

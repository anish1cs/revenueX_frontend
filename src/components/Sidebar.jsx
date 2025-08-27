import React from "react";
import {
  FaHome,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-blue-900 text-white h-screen transition-all duration-300 fixed left-0 top-0 flex flex-col`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-blue-700">
        <div className="flex items-center gap-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBQV8ym2gpq8drPPZt8BliGhNUYzXwlOc88Q&s"
            alt="Logo"
            className={`${
              collapsed ? "w-8 h-8 mx-auto" : "w-10 h-10"
            } rounded-full`}
          />
          {!collapsed && (
            <h1 className="text-xl font-bold whitespace-nowrap">FlashRent</h1>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white focus:outline-none"
        >
          {collapsed ? (
            <FaBars className="w-6 h-6" />
          ) : (
            <FaTimes className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700"
        >
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/customers"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700"
        >
          <FaUsers />
          {!collapsed && <span>Customers</span>}
        </Link>
        <Link
          to="/bills"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700"
        >
          <FaFileInvoiceDollar />
          {!collapsed && <span>Bills</span>}
        </Link>
        <Link
          to="/reports"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700"
        >
          <FaChartBar />
          {!collapsed && <span>Reports</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

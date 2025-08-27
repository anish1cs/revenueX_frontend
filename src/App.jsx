import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // ✅ import

const AppRoutes = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex">
          {/* Sidebar */}
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          {/* Main Content */}
          <div
            className={`flex-1 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
            {/* Navbar */}
            <Navbar collapsed={collapsed} />

            {/* Page Content */}
            <div className="mt-16 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/reports" element={<Reports />} />
                {/* Any unknown route → dashboard */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Only login route when not authenticated */}
          <Route path="/login" element={<Login />} />
          {/* Redirect anything else → login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;

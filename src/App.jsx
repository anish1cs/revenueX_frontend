import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";

// ✅ Protected Layout Wrapper
const ProtectedLayout = ({ collapsed, setCollapsed }) => {
  return (
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
          <Outlet /> {/* renders child routes */}
        </div>
      </div>
    </div>
  );
};

// ✅ Wrapper for handling login redirect to dashboard
const AuthRedirect = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // redirect after login
    }
  }, [isAuthenticated, navigate]);

  return <Login />;
};

const AppRoutes = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthRedirect />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<ProtectedLayout collapsed={collapsed} setCollapsed={setCollapsed} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          // If not logged in, redirect all protected pages → login
          <Route path="/*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;

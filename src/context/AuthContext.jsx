import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import axios from "axios";
import domain from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      const expiry = decoded.exp * 1000; // exp is in seconds → convert to ms
      const now = Date.now();

      if (expiry > now) {
        setIsAuthenticated(true);
        setToken(storedToken);
        if (savedUser) setUser(JSON.parse(savedUser));

        // ⏳ Schedule auto logout before token expiry (1 min earlier)
        const timeout = expiry - now - 60 * 1000;
        const timer = setTimeout(() => {
          handleLogout();
        }, timeout);
        return () => clearTimeout(timer);
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(newToken);

    // Optionally decode token and set auto logout again
    const decoded = jwtDecode(newToken);
    const expiry = decoded.exp * 1000;
    const now = Date.now();
    const timeout = expiry - now - 60 * 1000;
    setTimeout(() => {
      handleLogout();
    }, timeout);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // ✅ If backend has refresh endpoint, add it here
  const refreshToken = async () => {
    try {
      const res = await axios.post(`${domain}/users/refresh-token`, {"Authorization": token });
      if (res.data.data?.accessToken) {
        handleLogin(res.data.data.accessToken, user);
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error("Refresh failed", e);
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login: handleLogin,
        logout: handleLogout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

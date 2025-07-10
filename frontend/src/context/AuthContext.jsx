// src/context/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
const AuthContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until we check session/refresh
  const [user, setUser] = useState(null);

  // Fetch new access token using refreshToken in cookie
  const fetchAccessToken = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/refresh-token`, {
        withCredentials: true,
      });
      const newToken = res.data.accessToken;
      sessionStorage.setItem("accessToken", newToken);
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      console.log("⚠️ Refresh token expired or missing:", err.message);
      logout(); // optional: clear session
      return null;
    }
  };

  // Load accessToken from sessionStorage or refresh on app load
  useEffect(() => {
    const initAuth = async () => {

    setLoading(true);
      const storedToken = sessionStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
        await fetchUserProfile(storedToken);
      } else {
        await fetchAccessToken();
      }
      if(storedToken){
        await fetchUserProfile(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Fetch user profile using valid access token
  const fetchUserProfile = async (token = accessToken) => {
    try {

        setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("User profile fetched in context:", res.data.data);
     
      setUser(res.data.data);
        setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err.message);
    }
  };

  // Call this after login/signup
  const login = (token) => {
    sessionStorage.setItem("accessToken", token);
    setAccessToken(token);
    fetchUserProfile(token);
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log("Logout request failed:", err.message);
    }
    sessionStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        logout,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);

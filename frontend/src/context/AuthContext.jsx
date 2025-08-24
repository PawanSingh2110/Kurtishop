// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
 import { useNavigate } from "react-router-dom"; // make sure it's imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/me`, { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("👤 Authenticated User:", user);
    }
  }, [user]);

const backendURL = import.meta.env.VITE_BACKEND_URL;

const navigate = useNavigate(); // inside your component

const logout = async () => {
  try {
    await axios.post(`${backendURL}/api/logout`, {}, { withCredentials: true });
    setUser(null);
    navigate("/");              // ✅ Redirect to home page
    window.location.reload();   // ✅ Reload the window
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        email: user?.email,
        fetchUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

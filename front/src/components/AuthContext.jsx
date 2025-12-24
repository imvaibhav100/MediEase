import React, { useState, createContext, useContext } from "react";
import { login as apiLogin, signup as apiSignup } from "../api";
import useToast from "./useToast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const showToast = useToast();


  const login = async ({ email, password }) => {
    try {
      const res = await apiLogin(email, password);
      const { token, email: userEmail, name } = res.data;
      setUser({ email: userEmail, name, token });
      setIsAuthenticated(true);
      localStorage.setItem("MeduEase_user", JSON.stringify({ email: userEmail, name, token }));
      showToast(`Login successful! Welcome back, ${name || userEmail.split("@")[0]}`);
      return true;
    } catch (err) {
      showToast("Login failed: " + (err.response?.data || err.message));
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("MeduEase_user");
    showToast("Logout successful!");
  };

  const loginWithGoogle = () => {
    // In real app, this would use Google OAuth
    const googleUser = {
      id: Date.now(),
      name: "Google User",
      email: "user@gmail.com",
      provider: "google"
    };
    login(googleUser);
  };

  const resetPassword = (email) => {
    // In real app, this would send reset email to backend
    console.log("Password reset requested for:", email);
    return true;
  };

  const signup = async (userData) => {
    try {
      const res = await apiSignup(userData.email, userData.password, userData.name, userData.phone);
      const { token, email: userEmail, name } = res.data;
      setUser({ email: userEmail, name, token });
      setIsAuthenticated(true);
      localStorage.setItem("MeduEase_user", JSON.stringify({ email: userEmail, name, token }));
      showToast(`Signup successful! Welcome, ${name || userEmail.split("@")[0]}`);
      return true;
    } catch (err) {
      showToast("Signup failed: " + (err.response?.data || err.message));
      return false;
    }
  };

  // Check for existing user on load
  React.useEffect(() => {
    const savedUser = localStorage.getItem("MeduEase_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    loginWithGoogle,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

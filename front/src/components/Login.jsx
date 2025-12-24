import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const Login = ({ isOpen, onClose, onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      const success = await login({ email, password });
      if (success) {
        onClose();
        setEmail("");
        setPassword("");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-2 rounded-md font-medium transition"
          >
            Sign In
          </button>
        </form>
        
        {/* Forgot Password */}
        <div className="text-center mt-3">
          <button
            onClick={onForgotPassword}
            className="text-teal-600 hover:text-teal-700 text-sm"
          >
            Forgot Password?
          </button>
        </div>
        
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        {/* Google Sign In */}
        <button
          onClick={() => {
            loginWithGoogle();
            onClose();
          }}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-md font-medium transition flex items-center justify-center"
        >
          <i className="fab fa-google text-red-500 mr-2"></i>
          Continue with Google
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";

const ForgotPassword = ({ isOpen, onClose, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In real app, this would send reset email
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
        onBackToLogin();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        {!isSubmitted ? (
          <>
            <p className="text-gray-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
              >
                Send Reset Link
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={onBackToLogin}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Sent!</h3>
            <p className="text-gray-600">
              Check your email for a password reset link. Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

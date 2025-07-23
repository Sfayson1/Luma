import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-light text-gray-800 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Forgot <span className="text-purple-400">Password</span>
          </h1>
          <p className="text-gray-600 font-light">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm font-light">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-purple-400 text-white py-3 px-4 rounded-2xl font-light hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        ) : (
          /* Success State */
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>.
                Click the link in the email to reset your password.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-blue-800 text-sm font-light">
                <strong>Didn't receive the email?</strong> Check your spam
                folder or try again in a few minutes.
              </p>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToLogin}
            className="text-purple-400 hover:text-purple-500 text-sm font-light transition-colors"
          >
            ← Back to Login
          </button>
        </div>

        {/* Resend Option */}
        {isSubmitted && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setMessage("");
                setError("");
              }}
              className="text-gray-500 hover:text-gray-700 text-sm font-light transition-colors"
            >
              Try a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

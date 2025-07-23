import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/forgot-password");
          return;
        }

        setIsValidSession(true);
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/forgot-password");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async () => {
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // SUCCESS STATE FIRST
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="text-2xl font-light text-gray-800 mb-4">
                Password Reset Successful
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Your password has been successfully updated. You can now log in
                with your new password.
              </p>
            </div>
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-purple-400 text-white py-3 px-4 rounded-2xl font-light hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // INVALID SESSION
  if (!isValidSession) {
    return null;
  }

  // MAIN FORM
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-light text-gray-800 mb-2"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            Reset <span className="text-purple-400">Password</span>
          </h1>
          <p className="text-gray-600 font-light">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-6">
          {/* New Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Password Requirements:
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { key: "minLength", text: "At least 8 characters" },
                  { key: "hasUpperCase", text: "One uppercase letter" },
                  { key: "hasLowerCase", text: "One lowercase letter" },
                  { key: "hasNumber", text: "One number" },
                  { key: "hasSpecialChar", text: "One special character" },
                ].map(({ key, text }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className={`text-xs ${
                        passwordValidation[
                          key as keyof typeof passwordValidation
                        ]
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passwordValidation[
                        key as keyof typeof passwordValidation
                      ]
                        ? "✓"
                        : "○"}
                    </span>
                    <span
                      className={
                        passwordValidation[
                          key as keyof typeof passwordValidation
                        ]
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : confirmPassword && passwordsMatch
                    ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                    : "border-gray-200 focus:border-purple-400 focus:ring-purple-100"
                }`}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-600 text-sm mt-2 font-light">
                Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-green-600 text-sm mt-2 font-light">
                Passwords match ✓
              </p>
            )}
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
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            className="w-full bg-purple-400 text-white py-3 px-4 rounded-2xl font-light hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

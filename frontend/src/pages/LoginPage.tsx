import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Test function to create a user (for debugging)
  const testCreateUser = async () => {
    const testEmail = "test@example.com";
    const testPassword = "testpassword123";

    console.log("Creating test user...");
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error("Test signup failed:", error);
    } else {
      console.log("Test user created successfully:", data);
      alert(`Test user created with email: ${testEmail}`);
    }
  };

  // Test Supabase connection
  const testConnection = async () => {
    console.log("Testing Supabase connection...");
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log("Session test result:", { data, error });

      // Test a simple query that doesn't require admin
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      console.log("Get user test:", { userData, userError });

      alert("Connection test complete - check console for details");
    } catch (err) {
      console.error("Connection test failed:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = formData;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("=== LOGIN RESPONSE ===");
      console.log("Data:", data);
      console.log("Error:", error);

      if (error) {
        console.error("Login failed - Full error:", error);
        console.error("Error message:", error.message);
        console.error("Error status:", error.status);

        // More specific error handling
        if (error.message === "Invalid login credentials") {
          setError(
            "Email or password is incorrect. Please check your credentials."
          );
        } else if (error.message.includes("Email not confirmed")) {
          setError(
            "Please check your email and confirm your account before logging in."
          );
        } else {
          setError(`Login failed: ${error.message}`);
        }
      } else {
        console.log("Login successful! User:", data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      {/* Simple Header to match landing */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div className="text-4xl font-['Playfair_Display'] font-bold text-[#A78BFA]">
            Luma
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#1F2937] mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-[#6B7280] text-center mb-6">
            Log in to your journal
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Display error message if present */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-[#1F2937] text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#1F2937] text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-[#A78BFA] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A78BFA] hover:bg-[#93C5FD] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-[#6B7280]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#A78BFA] hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="mt-2 text-sm text-center text-[#6B7280]">
            <Link to="/" className="hover:underline text-[#6B7280]">
              ← Back to Luma
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

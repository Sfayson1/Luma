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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setError("Invalid email or password.");
    } else {
      navigate("/dashboard");
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
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <label className="block text-[#1F2937] text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-[#1F2937] text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
              />
            </div>

            <div className="text-right text-sm">
              <a href="#" className="text-[#A78BFA] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#A78BFA] hover:bg-[#93C5FD] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Log In
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password, username, firstName, lastName } = formData;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            firstName,
            lastName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

if (data?.user) {
  const { error: profileError } = await supabase
    .from("profiles")  // Change from "users" to "profiles"
    .insert([
      {
        id: data.user.id,
        username: username,
        first_name: firstName,
        last_name: lastName,
      },
    ]);

  if (profileError) {
    console.error("Profile creation failed:", profileError);
    setError("Account created but profile setup failed. Please contact support.");
    return;
  }

        navigate("/login");
      } else {
        setError("Signup succeeded but user data is missing.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
            Create Your Account
          </h2>
          <p className="text-[#6B7280] text-center mb-6">
            Join Luma and start journaling today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[#1F2937] text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-[#1F2937] text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-[#1F2937] text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#A78BFA] hover:bg-[#93C5FD] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-[#6B7280]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#A78BFA] hover:underline">
              Log in
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

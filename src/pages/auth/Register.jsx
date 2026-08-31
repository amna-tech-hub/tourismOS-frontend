import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Phone,
} from "lucide-react";
import tourix from "/public/tourixLogo.webp";

import { useRegister } from "../../api/queries/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) {
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone ? formData.phone.trim() : "";
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (name.length < 2) {
      setErrorMsg("Name must be at least 2 characters.");
      return;
    }

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (!phone) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      setErrorMsg("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        phone,
      });

      navigate("/auth/verify-otp", {
        state: { email },
      });
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Get Started
        </h2>
        <p className="text-xs text-white/80 mt-1 font-light">
          Create an account to begin your journey
        </p>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="w-full p-2.5 mb-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-900 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-2.5">
        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <User size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            type="text"
            name="phone"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Phone size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={registerMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
          >
            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full py-2.5 rounded-full bg-[#fbbf24] border border-amber-500/40 text-slate-800 font-semibold text-xs hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-4 text-xs text-slate-800">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-bold underline hover:text-black">
          Login
        </Link>
      </p>
    </div>
  );
}
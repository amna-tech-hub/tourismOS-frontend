import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../../api/queries/useAuth';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'traveler', // Default registration role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const registerMutation = useRegister();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    registerMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: (data) => {
          loginUser(data);
          if (formData.role === 'company_admin' || formData.role === 'company') {
            navigate('/company/dashboard');
          } else {
            navigate('/traveler/home');
          }
        },
        onError: (err) => {
          setErrorMsg(err.response?.data?.message || 'Failed to create account. Try again.');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold font-serif text-slate-900">
          Create <span className="text-amber-500">Your Account</span>
        </h2>
        <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full"></div>
        <p className="text-xs text-slate-400 subheading">Fill in your details to get started</p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-xl font-sans text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">👤</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">✉️</span>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-11 pr-11 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-xs text-slate-400"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">🔒</span>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full pl-11 pr-11 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-3.5 text-xs text-slate-400"
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="btn-yellow w-full rounded-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-amber-500/30"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-widest absolute font-sans">
          OR
        </span>
      </div>

      {/* Google Sign In */}
      <button className="w-full py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
        <span className="text-base">🌐</span> Continue with Google
      </button>

      {/* Login Navigation Link */}
      <p className="text-center text-xs text-slate-500 font-sans">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-amber-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
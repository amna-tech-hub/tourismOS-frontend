import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../api/queries/useAuth';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useLogin();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          loginUser(data);
          const role = data.user?.role || data.role;
console.log(data," role of user");

          if (role === 'company_admin' || role === 'company') {
            navigate('/company/dashboard');
          } else if (role === 'super_admin') {
            navigate('/super-admin/dashboard');
          } else {
            navigate('/traveler/home');
          }
        },
        onError: (err) => {
          setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold font-serif text-slate-900">
          Welcome <span className="text-amber-500">Back</span>
        </h2>
        <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full"></div>
        <p className="text-xs text-slate-400 subheading">Sign in to manage your account and tours</p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-xl font-sans text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">✉️</span>
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="relative">
          <span className="absolute left-4 top-3.5 text-slate-400">🔒</span>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn-yellow w-full rounded-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-amber-500/30"
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In →'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-sans">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-amber-600 font-semibold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
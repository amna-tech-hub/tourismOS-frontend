import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "../../api/queries/useAuth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const redirectUser = (user) => {
    switch (user.role) {
      case "super_admin":
        navigate("/super-admin/dashboard", { replace: true });
        break;
      case "company_admin":
      case "company":
        navigate("/company/dashboard", { replace: true });
        break;
      case "employee":
        navigate("/employee/dashboard", { replace: true });
        break;
      default:
        navigate("/traveler/home", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({ email, password });
      const user = response?.user || response?.data?.user;

      if (!user) {
        setErrorMsg("Login successful, but user information was not returned.");
        return;
      }

      loginUser(response);
      redirectUser(user);
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Welcome Home
        </h2>
        <p className="text-xs text-white/80 mt-1 font-light">
          Login to continue your AI travel journey
        </p>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="w-full p-2.5 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-900 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loginMutation.isPending}
            className="w-full px-4 py-3 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loginMutation.isPending}
            className="w-full px-4 py-3 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right pr-2">
          <Link
            to="/auth/forgot-password"
            className="text-xs text-slate-800 hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 rounded-full bg-[#fbbf24] border border-amber-500/40 text-slate-800 font-semibold text-sm hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Account Signup Link */}
      <p className="mt-4 text-xs text-slate-800">
        Don't have an account yet?{" "}
        <Link to="/auth/register" className="font-bold underline hover:text-black">
          Create here
        </Link>
      </p>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { useResetPassword } from "../../api/queries/useAuth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetMutation = useResetPassword();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("resetEmail");

    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Email address is required.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    resetMutation.mutate(
      {
        email,
        otp,
        newPassword,
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem("resetEmail");

          navigate("/auth/login", {
            state: {
              message:
                "Password reset successfully. You can now sign in.",
            },
          });
        },

        onError: (error) => {
          setErrorMsg(
            error.response?.data?.message ||
              "Unable to reset password."
          );
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-3 shadow-sm">
        <KeyRound size={26} className="text-white" />
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Reset Password
        </h2>
        <p className="text-xs text-white/80 mt-1 font-light max-w-xs">
          Enter the code sent to your email and create a new password.
        </p>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="w-full p-2.5 mb-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-900 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-2.5">
        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={resetMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* OTP Input */}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="6-Digit Code"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            disabled={resetMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs text-center tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <ShieldCheck size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={resetMutation.isPending}
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

        {/* Confirm New Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={resetMutation.isPending}
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
          disabled={resetMutation.isPending}
          className="w-full py-2.5 rounded-full bg-[#fbbf24] border border-amber-500/40 text-slate-800 font-semibold text-xs hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {resetMutation.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      {/* Back to Sign In Link */}
      <div className="mt-4 text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-800 font-bold hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
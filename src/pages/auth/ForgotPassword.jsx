import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Loader2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

import { useForgotPassword } from "../../api/queries/useAuth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const forgotMutation = useForgotPassword();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    forgotMutation.mutate(
      { email },
      {
        onSuccess: () => {
          sessionStorage.setItem("resetEmail", email);
          navigate("/auth/reset-password");
        },

        onError: (error) => {
          setErrorMsg(
            error.response?.data?.message ||
              "Unable to send password reset code."
          );
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-4 shadow-sm">
        <KeyRound size={26} className="text-white" />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Forgot Password?
        </h2>
        <p className="text-xs text-white/80 mt-1 font-light max-w-xs">
          Enter your email address and we'll send you a verification code to reset your password.
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
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={forgotMutation.isPending}
            className="w-full px-4 py-3 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={forgotMutation.isPending}
          className="w-full py-3 rounded-full bg-[#fbbf24] border border-amber-500/40 text-slate-800 font-semibold text-sm hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {forgotMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending Code...
            </>
          ) : (
            "Send Reset Code"
          )}
        </button>
      </form>

      {/* Back to Sign In Link */}
      <div className="mt-6 text-center">
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
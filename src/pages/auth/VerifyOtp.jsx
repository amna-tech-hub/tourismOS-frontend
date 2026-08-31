import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MailCheck,
  RefreshCw,
  Loader2,
  ArrowLeft,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  useVerifyOtp,
  useResendOtp,
} from "../../api/queries/useAuth";

import { useAuth } from "../../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!location.state?.email) {
      const savedEmail = sessionStorage.getItem(
        "verificationEmail"
      );

      if (savedEmail) {
        setEmail(savedEmail);
      }
    } else {
      sessionStorage.setItem(
        "verificationEmail",
        location.state.email
      );
    }
  }, [location.state]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Email address is required.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    verifyMutation.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: (response) => {
          sessionStorage.removeItem("verificationEmail");

          const user =
            response?.data?.user ||
            response?.user;

          loginUser(response);

          const role = user?.role;

          if (role === "super_admin") {
            navigate("/super-admin/dashboard");
          } else if (
            role === "company_admin" ||
            role === "company"
          ) {
            navigate("/company/dashboard");
          } else if (role === "employee") {
            navigate("/employee/dashboard");
          } else {
            navigate("/traveler/home");
          }
        },

        onError: (error) => {
          setErrorMsg(
            error.response?.data?.message ||
              "Invalid verification code."
          );
        },
      }
    );
  };

  const handleResend = () => {
    if (!email || resendTimer > 0) return;

    setErrorMsg("");
    setSuccessMsg("");

    resendMutation.mutate(
      { email },
      {
        onSuccess: (response) => {
          setSuccessMsg(
            response?.message ||
              "A new verification code has been sent."
          );

          setOtp("");
          setResendTimer(60);
        },

        onError: (error) => {
          setErrorMsg(
            error.response?.data?.message ||
              "Unable to resend verification code."
          );
        },
      }
    );
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-3 shadow-sm">
        <MailCheck size={26} className="text-white" />
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          Verify Email
        </h2>
        <p className="text-xs text-white/80 mt-1 font-light max-w-xs">
          Enter the 6-digit verification code sent to
        </p>
        <p className="text-xs font-semibold text-white break-all mt-0.5">
          {email || "your email address"}
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="w-full p-2.5 mb-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-900 text-xs text-center font-medium">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="w-full p-2.5 mb-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-950 text-xs text-center font-medium">
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleVerify} className="w-full space-y-2.5">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            disabled={verifyMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Verification Code */}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            placeholder="6-Digit Code"
            disabled={verifyMutation.isPending}
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white border-2 border-[#fbbf24] focus:border-slate-800 placeholder:text-slate-500 text-slate-800 text-xs text-center tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-slate-800/10 transition-all duration-200 shadow-sm"
          />
          <ShieldCheck size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={verifyMutation.isPending}
          className="w-full py-2.5 rounded-full bg-[#fbbf24] border border-amber-500/40 text-slate-800 font-semibold text-xs hover:bg-amber-300 transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      {/* Resend Action */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-800">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending || resendTimer > 0}
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline disabled:text-slate-500 disabled:no-underline"
        >
          {resendMutation.isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw size={13} />
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </>
          )}
        </button>
      </div>

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
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Map,
  Bot,
  Globe2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import tourix from '/public/tourixLogo.webp'; // Keep this if you want to use it

import { useAcceptInvite } from "../../api/queries/useAuth";

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const acceptInviteMutation = useAcceptInvite();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const isValidToken = useMemo(() => {
    return Boolean(token);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!token) {
      setError(
        "This invitation link is invalid. Please use the invitation link sent to your email."
      );
      return false;
    }

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (formData.name.trim().length < 2) {
      setError("Your name must contain at least 2 characters.");
      return false;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setError("");

      const response = await acceptInviteMutation.mutateAsync({
        token,
        name: formData.name.trim(),
        password: formData.password,
      });


      navigate("/auth/login", {
        replace: true,
        state: {
          message:
            "Your account has been created successfully. Please log in to continue.",
          email: response?.data?.email || "",
        },
      });
    } catch (err) {
      console.error("Accept invitation error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to accept this invitation. Please try again.";

      setError(message);
    }
  };

  /*
   * Invalid / missing token state
   */
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-white border border-border-subtle shadow-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-soft">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>

          <h1 className="text-2xl font-semibold text-text-primary">
            Invalid Invitation
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            This invitation link is missing or invalid. Please use the
            invitation link provided in your email.
          </p>

          <Link
            to="/auth/login"
            className="btn-primary mt-6 w-full"
          >
            Go to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1180px] items-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}
          <div className="relative hidden min-h-[720px] overflow-hidden lg:block">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-50" />

            {/* Decorative background */}
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col p-10">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-yellow-500/20">
 <img 
              src={tourix} 
              alt="Tourix Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />                </div>

                <div>
                  <div className="text-xl font-bold tracking-tight text-text-primary">
                    AI Tourism
                    <span className="text-yellow-500">OS</span>
                  </div>

                  <p className="text-xs text-text-muted">
                    The Intelligent Tourism Operating System
                  </p>
                </div>
              </div>

              {/* Main message */}
              <div className="mt-auto max-w-md">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-4 py-2 text-xs font-semibold text-yellow-700 backdrop-blur">
                  You're invited
                </div>

                <h2 className="text-5xl font-semibold leading-[1.05] text-text-primary">
                  Your next
                  <br />
                  adventure
                  <br />
                  <span className="text-yellow-500">awaits!</span>
                </h2>

                <p className="mt-6 max-w-sm text-base leading-7 text-text-secondary">
                  Complete your account setup and join TourismOS. Unlock
                  powerful tools designed to make tourism smarter, safer and
                  more connected.
                </p>

                {/* Feature box */}
                <div className="mt-8 grid grid-cols-4 gap-2 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-lg backdrop-blur-xl">

                  <Feature
                    icon={Map}
                    label="Smart"
                    subLabel="Planning"
                  />

                  <Feature
                    icon={ShieldCheck}
                    label="Safety"
                    subLabel="First"
                  />

                  <Feature
                    icon={Globe2}
                    label="Global"
                    subLabel="Support"
                  />

                  <Feature
                    icon={Bot}
                    label="AI"
                    subLabel="Assistant"
                  />

                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}
          <div className="flex min-h-[720px] items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14">

            <div className="w-full max-w-[500px]">

              {/* Mobile logo */}
              <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div className="text-lg font-bold">
                  AI Tourism
                  <span className="text-yellow-500">OS</span>
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">

                <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                  Complete
                  <span className="text-yellow-500"> Your Setup</span>
                </h1>


                <p className="mt-5 text-sm text-text-muted sm:text-base">
                  Create your account to accept the invitation
                </p>

              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-4"
              >

                {/* Name */}
                <InputField
                  icon={User}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  autoComplete="name"
                  disabled={acceptInviteMutation.isPending}
                />

                {/* Invitation email information */}
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50/60 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                      <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-yellow-800">
                        Invitation email
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-yellow-700">
                        Your account will be created using the email address
                        associated with this invitation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <PasswordField
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  disabled={acceptInviteMutation.isPending}
                />

                {/* Confirm Password */}
                <PasswordField
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                  disabled={acceptInviteMutation.isPending}
                />

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-error-light bg-error-soft px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />

                    <p className="text-sm leading-5 text-error-dark">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={acceptInviteMutation.isPending}
                  className="group flex w-full items-center justify-center rounded-2xl bg-yellow-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-yellow-500/20 transition-all duration-200 hover:bg-yellow-600 hover:shadow-yellow-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {acceptInviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account

                      <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

              </form>

              {/* Login */}
              <div className="mt-7 text-center">
                <p className="text-sm text-text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-semibold text-yellow-600 transition-colors hover:text-yellow-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Security message */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck className="h-4 w-4 text-success" />
                Your account information is securely protected
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   SMALL COMPONENTS
============================================================= */

const InputField = ({
  icon: Icon,
  type,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}) => {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="h-14 w-full rounded-2xl border border-yellow-100 bg-white pl-12 pr-4 text-sm text-text-primary shadow-sm outline-none transition-all placeholder:text-text-muted/70 hover:border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:bg-neutral-50"
      />
    </div>
  );
};

const PasswordField = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  setShowPassword,
  disabled,
}) => {
  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500" />

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={
          name === "password" ? "new-password" : "new-password"
        }
        disabled={disabled}
        className="h-14 w-full rounded-2xl border border-yellow-100 bg-white pl-12 pr-12 text-sm text-text-primary shadow-sm outline-none transition-all placeholder:text-text-muted/70 hover:border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:bg-neutral-50"
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

const Feature = ({ icon: Icon, label, subLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center py-2 text-center">
      <Icon className="h-6 w-6 text-yellow-500" />

      <span className="mt-2 text-[11px] font-semibold text-text-primary">
        {label}
      </span>

      <span className="text-[10px] text-text-muted">
        {subLabel}
      </span>
    </div>
  );
};

export default AcceptInvitation;
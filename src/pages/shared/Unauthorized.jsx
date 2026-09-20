import React from "react";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-error-soft border border-error-light">
          <ShieldX className="h-12 w-12 text-error" />
        </div>

        {/* Error Code */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-error">
          Error 401
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-5xl font-bold text-text-primary">
          Unauthorized
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-text-secondary">
          You don't have permission to access this page. Please log in with
          an account that has the required access.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="btn-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </button>
        </div>

        {/* Branding */}
        <div className="mt-12">
          <p className="text-sm text-text-muted">
            Tourism<span className="font-semibold text-yellow-500">OS</span>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Intelligent Travel
          </p>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
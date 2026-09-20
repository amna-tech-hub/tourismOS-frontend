import React from "react";
import { MapPinOff, ArrowLeft, Home, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-50 border border-yellow-200">
          <MapPinOff className="h-11 w-11 text-yellow-600" />

          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
        </div>

        {/* Error Code */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-5xl font-bold text-text-primary">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-text-secondary">
          Looks like you've taken a wrong turn. The page you're looking for
          doesn't exist or may have been moved.
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
            Explore Home
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

export default NotFound;
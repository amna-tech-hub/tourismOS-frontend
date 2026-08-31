// src/pages/PaymentCancelPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your payment was not completed. You can try again or choose a different tour.
        </p>
        
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium transition"
          >
            Browse Tours
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
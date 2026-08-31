import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GenericConfirmationPage from "./GenericConfirmationPage";
import api from "../../api/axios"; // adjust path if needed

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // =========================================================
  // PAYMENT PARAMETERS
  // =========================================================

  const type = searchParams.get("type") || "subscription";
  const paymentId = searchParams.get("payment_id");
  const sessionId = searchParams.get("session_id");

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  console.log("Payment Success Params:", {
    type,
    paymentId,
    sessionId,
  });

  // =========================================================
  // VERIFY PAYMENT
  // =========================================================

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await api.get("/payments/verify-session", {
          params: {
            session_id: sessionId,
            payment_id: paymentId,
            type,
          },
        });

        const result = response.data;

        console.log("Payment verification response:", result);

        if (result.success) {
          setPaymentData(result.data);
        } else {
          setError(
            result.message || "Could not verify payment."
          );
        }
      } catch (err) {
        console.error(
          "Payment verification error:",
          err.response?.data || err
        );

        setError(
          err.response?.data?.message ||
            "Network error while verifying payment."
        );
      } finally {
        setLoading(false);
      }
    };

    if (paymentId || sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
      setError("Invalid session details.");
    }
  }, [sessionId, paymentId, type]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">
          Verifying payment details...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow">
          <h2 className="text-lg font-bold text-red-600">
            Verification Failed
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // SUCCESS
  // =========================================================

  return (
    <GenericConfirmationPage
      type={type}
      orderId={paymentData?.orderId || paymentId}
      customerEmail={paymentData?.customerEmail}
      details={paymentData?.details}
      onPrimaryAction={() => {
        navigate(
          type === "subscription"
            ? "/dashboard/billing"
            : "/dashboard/bookings"
        );
      }}
    />
  );
};

export default PaymentSuccessPage;
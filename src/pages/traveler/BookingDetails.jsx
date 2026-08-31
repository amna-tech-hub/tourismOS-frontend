// src/pages/BookingDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingDetails, useCancelBooking } from "../../api/queries/useBooking";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  CreditCard,
  ArrowLeft,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
} from "lucide-react";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bookingData, isLoading, error } = useBookingDetails(id);
  const cancelBookingMutation = useCancelBooking();

  const [showCancelModal, setShowCancelModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[450px]">
        <Loader2 size={40} className="animate-spin text-amber-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-xl">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Booking Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          We couldn't retrieve the details for this reservation.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  const data = bookingData.data || bookingData;

  const isCancelled = data.status?.toLowerCase() === "cancelled";
  const isCompleted = data.status?.toLowerCase() === "completed";

  const handleCancelBooking = async () => {
    try {
      await cancelBookingMutation.mutateAsync({ bookingId: id });
      setShowCancelModal(false);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  const formattedAmount = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(data.totalAmount || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold capitalize tracking-wide ${
            isCancelled
              ? "bg-red-50 text-red-600 border border-red-100"
              : isCompleted
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber-50 text-amber-700 border border-amber-200/60"
          }`}
        >
          {isCancelled ? (
            <XCircle size={14} />
          ) : isCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <Clock size={14} />
          )}
          {data.status || "Confirmed"}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {/* Card Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-50/60 via-slate-50/30 to-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-amber-600 tracking-wider uppercase">
              Reservation Summary
            </p>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {data.tour?.title || "Tour Booking"}
            </h1>
          </div>
          <p className="text-xs font-mono font-medium text-slate-400">
            ID: #{id?.slice(-8)}
          </p>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-white text-amber-500 shadow-sm border border-slate-100 shrink-0">
              <Compass size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Tour Package</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {data.tour?.title || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-white text-amber-500 shadow-sm border border-slate-100 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Travel Date</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {data.travelDate
                  ? new Date(data.travelDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-white text-amber-500 shadow-sm border border-slate-100 shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Participants</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {data.participants} {data.participants === 1 ? "Person" : "People"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-white text-amber-500 shadow-sm border border-slate-100 shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Payment Status</p>
              <p className="text-sm font-semibold text-slate-800 capitalize mt-0.5">
                {data.paymentStatus || "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Banner */}
        <div className="mx-6 mb-6 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Charged</p>
            <p className="text-xl font-bold text-amber-400">{formattedAmount}</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
            Inclusive of taxes
          </span>
        </div>

        {/* Footer Action */}
        {!isCancelled && !isCompleted && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 active:bg-red-100 text-xs font-semibold transition"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-red-50 text-red-500 border border-red-100">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Reservation?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to cancel this booking for{" "}
                <strong className="text-slate-700">{data.tour?.title}</strong>? This action
                cannot be reversed.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelBookingMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelBookingMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-red-500/20"
              >
                {cancelBookingMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Users,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";

const BookingModal = ({
  tour,
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  error: externalError,
}) => {
  const [participants, setParticipants] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [provider, setProvider] = useState("stripe");
  const [error, setError] = useState("");

  // Reset modal state whenever a new booking modal opens
  useEffect(() => {
    if (isOpen) {
      setParticipants(1);
      setTravelDate("");
      setProvider("stripe");
      setError("");
    }
  }, [isOpen, tour?._id]);

  // Show error coming from parent mutation - FIXED VERSION
  useEffect(() => {
    console.log('External error received:', externalError);
    
    if (externalError) {
      // Try multiple ways to extract the error message
      let errorMessage = "Unable to create your booking. Please try again.";
      
      // Check if it's an Axios error with response.data.message
      if (externalError?.response?.data?.message) {
        errorMessage = externalError.response.data.message;
      } 
      // Check if it's a direct error object with message
      else if (externalError?.message) {
        errorMessage = externalError.message;
      }
      // Check if the error is the message itself (string)
      else if (typeof externalError === 'string') {
        errorMessage = externalError;
      }
      // Check for nested error structures
      else if (externalError?.data?.message) {
        errorMessage = externalError.data.message;
      }
      // Check if response.data is the message directly
      else if (externalError?.response?.data && typeof externalError.response.data === 'string') {
        errorMessage = externalError.response.data;
      }
      // Check for error in the response data object
      else if (externalError?.response?.data?.error?.message) {
        errorMessage = externalError.response.data.error.message;
      }
      
      setError(errorMessage);
    } else {
      setError(""); // Clear error when externalError is null/undefined
    }
  }, [externalError]);

  if (!isOpen || !tour) return null;

  const totalAmount = tour.price * participants;

  const formattedPrice = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });

  const handleParticipantsChange = (e) => {
    const value = e.target.value;

    // Allow the user to temporarily clear the input
    if (value === "") {
      setParticipants("");
      setError("");
      return;
    }

    const number = Number(value);

    if (Number.isNaN(number)) return;

    setParticipants(number);
    setError("");
  };

  const handleParticipantsBlur = () => {
    if (!participants || participants < 1) {
      setParticipants(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Validate participants
    if (!participants || participants < 1) {
      setError("Please enter at least 1 traveler.");
      return;
    }

    // Validate against the tour's absolute maximum
    if (
      tour.maxParticipants &&
      Number(participants) > Number(tour.maxParticipants)
    ) {
      setError(
        `This tour allows a maximum of ${tour.maxParticipants} travelers.`
      );
      return;
    }

    // Validate travel date
    if (!travelDate) {
      setError("Please select a travel date.");
      return;
    }

    onConfirm({
      tourId: tour._id,
      participants: Number(participants),
      travelDate,
      provider,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Book Tour
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {tour.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle
                size={18}
                className="text-red-500 mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-medium text-red-700">
                  Booking unavailable
                </p>

                <p className="text-sm text-red-600 mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Tour Price */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                Price per person
              </span>

              <span className="text-lg font-bold text-slate-900">
                {formattedPrice.format(tour.price)}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label
              htmlFor="participants"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5"
            >
              <Users size={16} />
              Number of Travelers
            </label>

            <input
              id="participants"
              type="number"
              min="1"
              value={participants}
              onChange={handleParticipantsChange}
              onBlur={handleParticipantsBlur}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none disabled:bg-slate-50 disabled:text-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
            />

            {tour.maxParticipants && (
              <p className="text-xs text-slate-400 mt-1.5">
                Maximum {tour.maxParticipants} travelers per booking.
              </p>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label
              htmlFor="travelDate"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5"
            >
              <Calendar size={16} />
              Travel Date
            </label>

            <input
              id="travelDate"
              type="date"
              value={travelDate}
              onChange={(e) => {
                setTravelDate(e.target.value);
                setError("");
              }}
              min={new Date().toISOString().split("T")[0]}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none disabled:bg-slate-50"
              required
            />
          </div>

          {/* Payment Provider */}
          <div>
            <label
              htmlFor="paymentProvider"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5"
            >
              <CreditCard size={16} />
              Payment Method
            </label>

            <select
              id="paymentProvider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              disabled={isProcessing}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none disabled:bg-slate-50"
            >
              <option value="stripe">
                Stripe (Credit/Debit Card)
              </option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          {/* Total */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">
                Total Amount
              </span>

              <span className="text-2xl font-bold text-amber-600">
                {formattedPrice.format(totalAmount || 0)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2
                    size={18}
                    className="mr-2 animate-spin"
                  />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
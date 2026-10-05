import React, { useState } from "react";
import { X, BookOpen, Calendar, MapPin, Loader2, Check } from "lucide-react";

const CreateJournalModal = ({
  bookings = [],
  onClose,
  onSubmit,
  isProcessing,
  error,
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState(
    bookings[0]?._id || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBookingId) return;

    onSubmit({
      bookingId: selectedBookingId,
    });
  };

  if (!bookings.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen size={20} className="text-yellow-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Create Journal
              </h2>

              <p className="text-xs text-slate-500">
                Choose a trip to start your journal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Select your trip
          </p>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {bookings.map((booking) => {
              const selected = booking._id === selectedBookingId;

              return (
                <button
                  key={booking._id}
                  type="button"
                  onClick={() => setSelectedBookingId(booking._id)}
                  className={`w-full text-left rounded-xl border transition overflow-hidden ${
                    selected
                      ? "border-amber-400 bg-amber-50/50"
                      : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Tour Image */}
                    {booking.tour?.coverImage ? (
                      <img
                        src={booking.tour.coverImage}
                        alt={booking.tour?.title || "Tour"}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-slate-400" />
                      </div>
                    )}

                    {/* Trip Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-slate-900 truncate">
                        {booking.tour?.title || "My Trip"}
                      </h3>

                      {booking.tour?.destination && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin size={13} />
                          <span className="truncate">
                            {booking.tour.destination}
                          </span>
                        </div>
                      )}

                      {booking.travelDate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Calendar size={13} />

                          {new Date(booking.travelDate).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected */}
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error?.response?.data?.message ||
                error?.message ||
                "Unable to create journal."}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing || !selectedBookingId}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Journal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournalModal;

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { useBookingDetails, useCancelBooking } from '../../api/queries/useBooking';

const BookingDetails = ({ bookingId }) => {
  const { data: bookingData, isLoading } = useBookingDetails(bookingId);
  const cancelBookingMutation = useCancelBooking();
  
  const [showCancelModal, setShowCancelModal] = useState(false);

  const booking = bookingData?.data;

  const handleCancel = async () => {
    try {
      await cancelBookingMutation.mutateAsync({ bookingId });
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50 rounded-2xl border border-slate-100 p-8">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  const isCancelled = booking?.status?.toLowerCase() === 'cancelled';
  const isCompleted = booking?.status?.toLowerCase() === 'completed';

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 via-white to-white">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Booking Overview
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            #{bookingId?.slice(-6) || 'N/A'}
          </h2>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
          isCancelled 
            ? 'bg-red-50 text-red-600 border border-red-100' 
            : isCompleted 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {isCancelled ? (
            <XCircle size={14} />
          ) : isCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          {booking?.status || 'Active'}
        </span>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-6">
        {/* Detail Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-100">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Date</p>
              <p className="text-sm font-semibold text-slate-800">
                {booking?.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-100">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Time</p>
              <p className="text-sm font-semibold text-slate-800">
                {booking?.time || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-100">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Guest / Customer</p>
              <p className="text-sm font-semibold text-slate-800">
                {booking?.customerName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-100">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Location</p>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-[140px]">
                {booking?.location || 'N/A'}
              </p>
            </div>
          </div>

        </div>

        {/* Cancellation Notice (If cancelled) */}
        {isCancelled && (
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 text-xs text-red-600 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>This booking has been cancelled and is no longer active.</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!isCancelled && !isCompleted && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 active:bg-red-100 text-xs font-semibold transition shadow-sm"
          >
            Cancel Booking
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            
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
              <h3 className="text-base font-bold text-slate-900">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to cancel this booking? This action cannot be undone.
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
                onClick={handleCancel}
                disabled={cancelBookingMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-red-500/20"
              >
                {cancelBookingMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
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
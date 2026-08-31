// src/pages/MyBookings.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock3,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CreditCard,
  Compass,
  AlertTriangle,
  X,
  BookA,
  BookAlertIcon,
  TowelRackIcon,
} from "lucide-react";
import {
  useMyBookings,
  useCancelBooking,
} from "../../api/queries/useBooking";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "all", label: "All bookings" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useMyBookings();

  const cancelBookingMutation = useCancelBooking();

  const bookings = data?.data || [];

  const filteredBookings =
    selectedStatus === "all"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === selectedStatus
        );

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await cancelBookingMutation.mutateAsync({ bookingId: bookingToCancel._id });
      toast.success("Booking cancelled successfully");
      setBookingToCancel(null);
      refetch();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        className: "badge-yellow",
        icon: Clock3,
      },
      confirmed: {
        label: "Confirmed",
        className: "badge-success",
        icon: CheckCircle2,
      },
      completed: {
        label: "Completed",
        className: "badge-info",
        icon: CheckCircle2,
      },
      cancelled: {
        label: "Cancelled",
        className: "badge-error",
        icon: XCircle,
      },
    };

    return (
      configs[status?.toLowerCase()] || {
        label: status || "Unknown",
        className: "badge-gray",
        icon: Clock3,
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6 my-6">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto animate-spin text-brand-primary"
          />
          <p className="mt-4 text-sm text-text-secondary">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="mx-auto max-w-lg p-4 sm:p-6 my-8">
        <div className="card px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-soft">
            <AlertCircle size={24} className="text-error" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            Unable to load bookings
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            {error.message || "Something went wrong while loading your bookings."}
          </p>

          <button
            onClick={() => refetch()}
            className="btn-primary-sm mt-6"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty
  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-6 my-8">
        <div className="card px-6 py-16 text-center sm:px-10">
         

          <h1 className="mt-5 text-2xl font-bold">
            No bookings yet
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            You haven't booked a tour yet. Explore available experiences
            and start planning your next adventure.
          </p>

          <button
            onClick={() => navigate("/")}
            className="btn-primary mt-7"
          >
            Explore Tours
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 space-y-7">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-brand-dark">
            <CalendarDays size={16} />
            <span className="font-medium">Your travel plans</span>
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-text-muted">
            Manage your upcoming and past adventures.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="btn-outline-sm self-start sm:self-auto"
        >
          <Compass size={16} />
          Explore Tours
        </button>
      </div>

      {/* Status Navigation */}
      <div className="border-b border-border-light">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {STATUS_OPTIONS.map((status) => {
            const isActive = selectedStatus === status.value;

            const count =
              status.value === "all"
                ? bookings.length
                : bookings.filter(
                    (booking) => booking.status === status.value
                  ).length;

            return (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium ${
                  isActive
                    ? "border-brand-primary text-brand-dark"
                    : "border-transparent text-text-muted"
                }`}
              >
                {status.label}

                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    isActive
                      ? "bg-brand-light text-brand-dark"
                      : "bg-neutral-100 text-text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;

          const isCancellable =
            booking.status === "pending" ||
            booking.status === "confirmed";

          const canCompletePayment =
            booking.status === "pending" &&
            booking.payment?.status === "pending";

          return (
            <article
              key={booking._id}
              className="card overflow-hidden transition hover:shadow-md"
            >
              <div className="p-5 sm:p-6">
                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {booking.tour?.title || "Tour"}
                      </h2>

                      <span className={statusConfig.className}>
                        <StatusIcon size={13} />
                        <span className="ml-1">
                          {statusConfig.label}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                      <MapPin size={15} />
                      <span>
                        {booking.tour?.destination ||
                          booking.tour?.to ||
                          "Destination"}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                      Total
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-brand-dark">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5 grid gap-3 border-t border-border-subtle pt-5 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-text-secondary">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                        Travel date
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-text-primary">
                        {formatDate(booking.travelDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-text-secondary">
                      <Users size={17} />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                        Travelers
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-text-primary">
                        {booking.participants}{" "}
                        {booking.participants === 1
                          ? "traveler"
                          : "travelers"}
                      </p>
                    </div>
                  </div>

                  {booking.payment && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-text-secondary">
                        <CreditCard size={17} />
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                          Payment
                        </p>

                        <p className="mt-0.5 text-sm font-medium capitalize text-text-primary">
                          {booking.payment.status || "Pending"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-border-subtle pt-5">
                  {isCancellable && (
                    <button
                      onClick={() => setBookingToCancel(booking)}
                      disabled={cancelBookingMutation.isPending}
                      className="btn-outline-sm text-error disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Cancel Booking
                    </button>
                  )}

                  {canCompletePayment && (
                    <button
                      onClick={() =>
                        navigate(`/payment?bookingId=${booking._id}`)
                      }
                      className="btn-primary-sm"
                    >
                      <CreditCard size={15} />
                      Complete Payment
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/bookings/${booking._id}`)
                    }
                    className="btn-outline-sm"
                  >
                    View Details
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Filter empty */}
      {filteredBookings.length === 0 && (
        <div className="card-soft px-6 py-12 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
            <CalendarDays
              size={21}
              className="text-text-muted"
            />
          </div>

          <h3 className="mt-4 text-lg font-semibold">
            No {selectedStatus} bookings
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            There are no bookings matching this status.
          </p>
        </div>
      )}

      {/* Cancellation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-red-50 text-red-500 border border-red-100">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={() => setBookingToCancel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to cancel your booking for{" "}
                <strong className="text-slate-700">
                  {bookingToCancel.tour?.title || "this tour"}
                </strong>
                ?
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                disabled={cancelBookingMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={confirmCancelBooking}
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

export default MyBookings;
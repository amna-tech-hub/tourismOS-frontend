// src/pages/employee/Bookings.jsx

import React, { useState } from "react";
import {
  Search,
  Eye,
  Ticket,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar,
  Users,
  DollarSign,
  Mail,
  Phone,
} from "lucide-react";

import {
  useMyTourBookings,
  useBookingDetails,
} from "../../api/queries/useEmployee";

// ======================================================
// HELPERS
// ======================================================

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "TR";
  }

  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
};

// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  const map = {
    pending:
      "border-amber-100 bg-amber-50 text-amber-700",
    confirmed:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    cancelled:
      "border-rose-100 bg-rose-50 text-rose-700",
    completed:
      "border-slate-200 bg-slate-100 text-slate-700",
  };

  const className =
    map[normalizedStatus] || map.completed;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {normalizedStatus || "—"}
    </span>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({ title, value, icon: Icon, iconClass }) => {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

// ======================================================
// BOOKING ROW
// ======================================================

const BookingRow = ({ booking, onView }) => {
  const traveler = booking?.traveler || {};
  const tour = booking?.tour || {};

  const name = traveler?.name || "Traveler";

  return (
    <div className="flex flex-col gap-4 border-b border-border-subtle px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      {/* TRAVELER */}

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-xs font-semibold text-yellow-600">
          {traveler?.avatar ? (
            <img
              src={traveler.avatar}
              alt={name}
              className="h-11 w-11 rounded-xl object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            {name}
          </p>

          <p className="truncate text-xs text-text-muted">
            {tour?.title || "Tour"}
          </p>
        </div>
      </div>

      {/* DETAILS */}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Calendar size={13} className="text-slate-400" />
          {formatDate(booking?.createdAt)}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Users size={13} className="text-slate-400" />
          {booking?.participants || 1}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <DollarSign size={13} className="text-slate-400" />
          {formatNumber(booking?.totalAmount || 0)}
        </div>

        <StatusBadge status={booking?.status} />
      </div>

      {/* ACTION */}

      <button
        type="button"
        onClick={() => onView(booking)}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border-subtle bg-bg-card px-3 py-2 text-xs font-medium text-text-secondary"
      >
        <Eye size={14} />
        View
      </button>
    </div>
  );
};

// ======================================================
// BOOKING DETAILS MODAL
// ======================================================

const BookingDetailsModal = ({ bookingId, onClose }) => {
  const { data: response, isLoading, isError } = useBookingDetails(bookingId);

  if (!bookingId) return null;

  const booking = response?.data || {};

  const traveler = booking?.traveler || {};
  const tour = booking?.tour || {};
  const payment = booking?.payment || {};

  const name = traveler?.name || "Traveler";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-subtle bg-bg-card">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Booking Details
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Full information about this booking.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-5 px-6 py-6">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 size={28} className="animate-spin text-yellow-500" />
              <p className="text-sm text-text-muted">Loading booking...</p>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>Unable to load booking details.</span>
            </div>
          )}

          {!isLoading && !isError && booking?._id && (
            <>
              {/* TRAVELER */}

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-sm font-semibold text-yellow-600">
                  {traveler?.avatar ? (
                    <img
                      src={traveler.avatar}
                      alt={name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    getInitials(name)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {name}
                  </p>

                  <p className="truncate text-xs text-text-muted">
                    {traveler?.email || "—"}
                  </p>
                </div>
              </div>

              {/* TOUR */}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Tour
                </p>

                <p className="mt-2 text-sm font-medium text-text-primary">
                  {tour?.title || "—"}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {tour?.from || "—"} → {tour?.to || "—"}
                </p>
              </div>

              {/* GRID */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Calendar size={14} />
                    Booked
                  </div>

                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {formatDate(booking?.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Users size={14} />
                    Participants
                  </div>

                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {booking?.participants || 1}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <DollarSign size={14} />
                    Total Amount
                  </div>

                  <p className="mt-2 text-sm font-medium text-text-primary">
                    ${formatNumber(booking?.totalAmount || 0)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={booking?.status} />
                  </div>
                </div>
              </div>

              {/* CONTACT */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Mail size={14} />
                    Email
                  </div>

                  <p className="mt-2 break-all text-sm font-medium text-text-primary">
                    {traveler?.email || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Phone size={14} />
                    Phone
                  </div>

                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {traveler?.phone || "—"}
                  </p>
                </div>
              </div>

              {/* PAYMENT */}

              {payment?._id && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Payment
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Status
                    </span>

                    <span className="text-sm font-medium capitalize text-text-primary">
                      {payment?.status || "—"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Method
                    </span>

                    <span className="text-sm font-medium text-text-primary">
                      {payment?.method || "—"}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-border-subtle px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Bookings = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // ====================================================
  // QUERY
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyTourBookings({
    page,
    limit,
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // ====================================================
  // API DATA
  // ====================================================

  const bookings = response?.data || [];
  const meta = response?.meta || {};

  // ====================================================
  // STATS
  // ====================================================

  const totalCount = meta.totalDocuments ?? bookings.length;

  const confirmedCount = bookings.filter(
    (b) => b?.status?.toLowerCase() === "confirmed"
  ).length;

  const pendingCount = bookings.filter(
    (b) => b?.status?.toLowerCase() === "pending"
  ).length;

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // ====================================================
  // VIEW
  // ====================================================

  const handleView = (booking) => {
    setSelectedBookingId(booking._id || booking.id);
  };

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (isLoading && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-yellow-500" />

          <p className="text-sm text-text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (isError && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            Unable to load bookings
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Something went wrong while loading your bookings.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary mt-5 cursor-pointer"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 pb-10">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-yellow-600">Employee Portal</p>

          <span className="badge-yellow">Bookings</span>
        </div>

        <h1 className="mt-1 text-3xl font-semibold text-text-primary">
          Bookings
        </h1>

        <p className="mt-1 max-w-xl text-sm text-text-muted">
          All bookings made on the tours you created.
        </p>
      </div>

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Bookings"
          value={formatNumber(totalCount)}
          icon={Ticket}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <StatCard
          title="Confirmed"
          value={formatNumber(confirmedCount)}
          icon={Ticket}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Pending"
          value={formatNumber(pendingCount)}
          icon={Ticket}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="rounded-2xl border border-border-subtle bg-bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}

          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by traveler, email, or booking ID..."
              className="h-11 w-full rounded-xl border border-border-subtle bg-bg-card pl-10 pr-10 text-sm text-text-primary outline-none placeholder:text-slate-400 focus:border-yellow-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* FILTER + REFRESH */}

          <div className="flex items-center gap-3">
            {isFetching && (
              <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                <Loader2 size={13} className="animate-spin" />
                Updating...
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <Filter size={15} className="ml-2 mr-1 text-slate-400" />

                {[
                  ["all", "All"],
                  ["pending", "Pending"],
                  ["confirmed", "Confirmed"],
                  ["completed", "Completed"],
                  ["cancelled", "Cancelled"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(value);
                      setPage(1);
                    }}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium ${
                      statusFilter === value
                        ? "bg-white text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border-subtle bg-bg-card text-text-muted disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isFetching ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          EMPTY / LIST
      ================================================== */}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-bg-card px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
            <Ticket size={27} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-text-primary">
            {search || statusFilter !== "all"
              ? "No bookings found"
              : "No bookings yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            {search || statusFilter !== "all"
              ? "Try changing your search or filter to find what you're looking for."
              : "Bookings on your tours will appear here once travelers start booking."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card">
          {bookings.map((booking) => (
            <BookingRow
              key={booking._id || booking.id}
              booking={booking}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {bookings.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            Showing{" "}
            <span className="font-medium text-text-secondary">
              {bookings.length}
            </span>{" "}
            booking{bookings.length !== 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border-subtle text-text-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-yellow-500 px-3 text-xs font-semibold text-white">
              {page}
            </span>

            <button
              type="button"
              disabled={
                isFetching ||
                (meta.totalPages
                  ? page >= meta.totalPages
                  : bookings.length < limit)
              }
              onClick={() => setPage((prev) => prev + 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border-subtle text-text-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      <BookingDetailsModal
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
      />
    </div>
  );
};

export default Bookings;
import React, { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleDollarSign,
  MoreVertical,
  Eye,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  CreditCard,
  MapPin,
  User,
  Ban,
  ArrowUpRight,
} from "lucide-react";

import {
  useCompanyBookings,
  useUpdateBookingStatus,
} from "../../api/queries/useCompany";

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (amount, currency = "PKR") => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   STATUS BADGES
========================================================= */

const BookingStatusBadge = ({ status }) => {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock3,
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    confirmed: {
      label: "Confirmed",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className:
        "bg-rose-50 text-rose-700 border-rose-200",
    },

    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },
  };

  const current =
    config[status] || {
      label: status || "Unknown",
      icon: Clock3,
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
    };

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.className}`}
    >
      <Icon size={13} />
      {current.label}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const config = {
    paid: {
      label: "Paid",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    pending: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    refunded: {
      label: "Refunded",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },
  };

  const current =
    config[status] || {
      label: status || "Unknown",
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
    };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.className}`}
    >
      {current.label}
    </span>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconWrapper,
  iconColor,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-slate-900 ">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconWrapper}`}
        >
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   BOOKING ACTIONS
========================================================= */

const BookingActions = ({
  booking,
  onView,
  onUpdateStatus,
  updating,
}) => {
  const status = booking.status;

  const handleAction = (newStatus) => {
    onUpdateStatus(booking._id, newStatus);
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View */}
      <button
        type="button"
        onClick={() => onView(booking)}
        disabled={updating}
        title="View Details"
        className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer disabled:opacity-50"
      >
        <Eye size={16} />
      </button>

      {/* Pending → Confirm */}
      {status === "pending" && (
        <button
          type="button"
          onClick={() => handleAction("confirmed")}
          disabled={updating}
          title="Confirm Booking"
          className="w-9 h-9 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer disabled:opacity-50"
        >
          {updating ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Check size={16} />
          )}
        </button>
      )}

      {/* Pending → Cancel */}
      {status === "pending" && (
        <button
          type="button"
          onClick={() => handleAction("cancelled")}
          disabled={updating}
          title="Cancel Booking"
          className="w-9 h-9 rounded-lg border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-600 hover:bg-rose-100 hover:text-rose-700 cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
        </button>
      )}

      {/* Confirmed → Complete */}
      {status === "confirmed" && (
        <button
          type="button"
          onClick={() => handleAction("completed")}
          disabled={updating}
          title="Mark Completed"
          className="w-9 h-9 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer disabled:opacity-50"
        >
          {updating ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={16} />
          )}
        </button>
      )}

      {/* Confirmed → Cancel */}
      {status === "confirmed" && (
        <button
          type="button"
          onClick={() => handleAction("cancelled")}
          disabled={updating}
          title="Cancel Booking"
          className="w-9 h-9 rounded-lg border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-600 hover:bg-rose-100 hover:text-rose-700 cursor-pointer disabled:opacity-50"
        >
          <Ban size={16} />
        </button>
      )}
    </div>
  );
};
/* =========================================================
   BOOKING DETAILS MODAL
========================================================= */

const BookingDetailsModal = ({
  booking,
  onClose,
}) => {
  if (!booking) return null;

  const traveler = booking.traveler || {};
  const tour = booking.tour || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-yellow-600 font-semibold">
              Booking Details
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900 ">
              {tour.title || "Tour Booking"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Traveler */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Traveler
            </h3>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <User
                    size={18}
                    className="text-yellow-700"
                  />
                  {console.log(traveler)
                  }
                  <img src={traveler.profilePicture.url} alt="" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {traveler.name ||
                      "Unknown Traveler"}
                  </p>

                  <p className="text-sm text-slate-500 truncate">
                    {traveler.email || "No email"}
                  </p>

                  {traveler.phone && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {traveler.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Tour */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Tour Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MapPin size={15} />
                  <span className="text-xs">
                    Tour
                  </span>
                </div>

                <p className="font-medium text-slate-900">
                  {tour.title || "—"}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <CircleDollarSign size={15} />
                  <span className="text-xs">
                    Tour Price
                  </span>
                </div>

                <p className="font-medium text-slate-900">
                  {formatCurrency(tour.price)}
                </p>
              </div>
            </div>
          </section>

          {/* Booking information */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Booking Information
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="border border-slate-200 rounded-xl p-3">
                <p className="text-xs text-slate-400">
                  Participants
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {booking.participants || 1}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <p className="text-xs text-slate-400">
                  Amount
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(
                    booking.totalAmount
                  )}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <p className="text-xs text-slate-400">
                  Travel Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(
                    booking.travelDate
                  )}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <p className="text-xs text-slate-400">
                  Booked On
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(
                    booking.bookingDate ||
                      booking.createdAt
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Status & Payment
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <BookingStatusBadge
                status={booking.status}
              />

              <PaymentStatusBadge
                status={booking.paymentStatus}
              />

              {booking.paymentMethod && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <CreditCard size={13} />
                  {booking.paymentMethod}
                </span>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline px-5 py-2.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const CompanyBookings = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [paymentFilter, setPaymentFilter] =
    useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search,
      status:
        statusFilter !== "all"
          ? statusFilter
          : "",
      paymentStatus:
        paymentFilter !== "all"
          ? paymentFilter
          : "",
      sort: "createdAt",
      order: "desc",
    }),
    [
      page,
      search,
      statusFilter,
      paymentFilter,
    ]
  );

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useCompanyBookings(queryParams);

  const updateStatusMutation =
    useUpdateBookingStatus();

  const bookings = response?.data || [];
  const meta = response?.meta || {};

  /* =========================================================
     PAGE STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    const pending = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const confirmed = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const paidRevenue = bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "paid"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(booking.totalAmount || 0),
        0
      );

    return {
      pending,
      confirmed,
      paidRevenue,
    };
  }, [bookings]);

  /* =========================================================
     STATUS UPDATE
  ========================================================= */

  const handleUpdateStatus = async (
    bookingId,
    status
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: bookingId,
        status,
      });
    } catch (error) {
      console.error(
        "Booking status update failed:",
        error
      );
    }
  };

  /* =========================================================
     FILTERS
  ========================================================= */

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePaymentChange = (value) => {
    setPaymentFilter(value);
    setPage(1);
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = meta.totalPages || 1;

  const goToPreviousPage = () => {
    setPage((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const goToNextPage = () => {
    setPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  // IMPORTANT:
  // Only show the full-page loader on the very first load.
  // When search/filters/pagination change, keep the current page visible
  // and use isFetching for the small loading indicators instead.

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-[calc(100vh-80px)] ">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Company</span>
              <span>/</span>
              <span className="text-slate-900">
                Bookings
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage bookings, travelers, payments and tour reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-outline self-start lg:self-auto px-4 py-2.5 gap-2 cursor-pointer"
          >
            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Bookings"
            value={
              meta.totalDocuments ??
              bookings.length
            }
            subtitle="All company bookings"
            icon={CalendarDays}
            iconWrapper="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Awaiting confirmation"
            icon={Clock3}
            iconWrapper="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            subtitle="Active reservations"
            icon={CheckCircle2}
            iconWrapper="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Paid Revenue"
            value={formatCurrency(
              stats.paidRevenue
            )}
            subtitle="From current results"
            icon={CircleDollarSign}
            iconWrapper="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 mb-5">
          <div className="p-4">

            <div className="flex flex-col xl:flex-row gap-3">

              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  placeholder="Search traveler, tour or booking..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                />
              </div>

              {/* Status */}
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value
                    )
                  }
                  className="h-11 w-full xl:w-[170px] pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 cursor-pointer appearance-none"
                >
                  <option value="all">
                    All Statuses
                  </option>
                  <option value="pending">
                    Pending
                  </option>
                  <option value="confirmed">
                    Confirmed
                  </option>
                  <option value="completed">
                    Completed
                  </option>
                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Payment */}
              <div className="relative">
                <CreditCard
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <select
                  value={paymentFilter}
                  onChange={(e) =>
                    handlePaymentChange(
                      e.target.value
                    )
                  }
                  className="h-11 w-full xl:w-[170px] pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 cursor-pointer appearance-none"
                >
                  <option value="all">
                    All Payments
                  </option>
                  <option value="paid">
                    Paid
                  </option>
                  <option value="pending">
                    Pending
                  </option>
                  <option value="refunded">
                    Refunded
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOOKINGS TABLE
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* Table heading */}
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All Bookings
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Reservations made for your company's tours.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 text-xs font-medium text-slate-500">
              {isFetching && (
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                  Updating...
                </span>
              )}

              <span className="inline-flex items-center gap-2">
                {meta.totalDocuments || 0} bookings
              </span>
            </div>
          </div>

          {/* Initial loading only */}
          {isLoading && bookings.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-6">
              <Loader2
                size={30}
                className="animate-spin text-yellow-500"
              />

              <p className="text-sm text-slate-500 mt-3">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <CalendarDays
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No bookings found
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Try changing your search or filters to find bookings.
              </p>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60">

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Traveler
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Tour
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Travel Date
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Guests
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Payment
                      </th>

                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>

                      <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {bookings.map((booking) => {
                      const traveler =
                        booking.traveler || {};

                      const tour =
                        booking.tour || {};

                      return (
                        <tr
                          key={booking._id}
                          className="hover:bg-slate-50/50"
                        >

                          {/* Traveler */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0">
                              
                                <img src={traveler.profilePicture.url} alt="" className="text-yellow-600"/>
                               
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900  max-w-[155px]">
                                  {traveler.name ||
                                    "Unknown Traveler"}
                                </p>

                                <p className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                                  {traveler.email ||
                                    "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Tour */}
                          <td className="px-5 py-4">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate max-w-[190px]">
                                {tour.title ||
                                  "Unknown Tour"}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {formatCurrency(
                                  tour.price
                                )}{" "}
                                / person
                              </p>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />

                              <span className="text-sm text-slate-600 whitespace-nowrap">
                                {formatDate(
                                  booking.travelDate
                                )}
                              </span>
                            </div>
                          </td>

                          {/* Guests */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                              <Users
                                size={15}
                                className="text-slate-400"
                              />

                              {booking.participants ||
                                1}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                              {formatCurrency(
                                booking.totalAmount
                              )}
                            </p>
                          </td>

                          {/* Payment */}
                          <td className="px-5 py-4">
                            <PaymentStatusBadge
                              status={
                                booking.paymentStatus
                              }
                            />
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <BookingStatusBadge
                              status={
                                booking.status
                              }
                            />
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4">
                            <BookingActions
                              booking={booking}
                              onView={
                                setSelectedBooking
                              }
                              onUpdateStatus={
                                handleUpdateStatus
                              }
                              updating={
                                updateStatusMutation.isPending
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE / TABLET
              ================================================= */}

              <div className="lg:hidden divide-y divide-slate-100">

                {bookings.map((booking) => {
                  const traveler =
                    booking.traveler || {};

                  const tour =
                    booking.tour || {};

                  return (
                    <div
                      key={booking._id}
                      className="p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0">
                           
                                <img src={traveler.profilePicture.url} alt="" className="text-yellow-600"/>
                               
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {traveler.name ||
                                "Unknown Traveler"}
                            </p>

                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {traveler.email || "—"}
                            </p>
                          </div>
                        </div>

                        <BookingActions
                          booking={booking}
                          onView={
                            setSelectedBooking
                          }
                          onUpdateStatus={
                            handleUpdateStatus
                          }
                          updating={
                            updateStatusMutation.isPending
                          }
                        />
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-semibold text-slate-900">
                          {tour.title ||
                            "Unknown Tour"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatCurrency(
                            tour.price
                          )}{" "}
                          per person
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">

                        <div>
                          <p className="text-[11px] text-slate-400">
                            Guests
                          </p>

                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {booking.participants ||
                              1}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400">
                            Amount
                          </p>

                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {formatCurrency(
                              booking.totalAmount
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400">
                            Travel Date
                          </p>

                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {formatDate(
                              booking.travelDate
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400">
                            Booked On
                          </p>

                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {formatDate(
                              booking.bookingDate ||
                                booking.createdAt
                            )}
                          </p>
                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-5">
                        <BookingStatusBadge
                          status={booking.status}
                        />

                        <PaymentStatusBadge
                          status={
                            booking.paymentStatus
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              <div className="px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <p className="text-xs text-slate-500">
                  Showing page{" "}
                  <span className="font-medium text-slate-700">
                    {meta.page || page}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={page <= 1}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <div className="min-w-9 h-9 px-2 rounded-lg bg-yellow-500 text-white flex items-center justify-center text-sm font-medium">
                    {page}
                  </div>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={
                      page >= totalPages
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight size={17} />
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =======================================================
          DETAILS MODAL
      ======================================================= */}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() =>
          setSelectedBooking(null)
        }
      />
    </div>
  );
};

export default CompanyBookings;
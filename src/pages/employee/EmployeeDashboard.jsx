// src/pages/employee/Dashboard.jsx

import React from "react";
import { Link } from "react-router-dom";
import {
  FaMountain,
  FaTicketAlt,
  FaStar,
  FaComments,
} from "react-icons/fa";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
  User,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { useEmployeeDashboard } from "../../api/queries/useEmployee";

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
    return parts[0]?.slice(0, 2).toUpperCase() || "US";
  }

  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({ title, value, icon: Icon, iconClass, subtitle }) => {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-muted">{title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

// ======================================================
// SECTION HEADER
// ======================================================

const SectionHeader = ({ title, subtitle, linkTo, linkLabel }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>

        {subtitle && (
          <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
        )}
      </div>

      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600"
        >
          {linkLabel}
          <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
};

// ======================================================
// RECENT BOOKING ROW
// ======================================================

const RecentBookingRow = ({ booking }) => {
  const traveler = booking?.traveler || {};
  const tour = booking?.tour || {};

  const name = traveler?.name || "Traveler";

  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3 last:border-b-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-xs font-semibold text-yellow-600">
        {traveler?.avatar ? (
          <img
            src={traveler.avatar}
            alt={name}
            className="h-10 w-10 rounded-xl object-cover"
          />
        ) : (
          getInitials(name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{name}</p>

        <p className="truncate text-xs text-text-muted">
          {tour?.title || "Tour"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-text-primary">
          ${formatNumber(booking?.totalAmount || 0)}
        </p>

        <p className="mt-0.5 text-xs text-text-muted">
          {formatDate(booking?.createdAt)}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// RECENT REVIEW ROW
// ======================================================

const RecentReviewRow = ({ review }) => {
  const user = review?.user || {};
  const tour = review?.tour || {};

  const name = user?.name || "Traveler";

  return (
    <div className="flex items-start gap-3 border-b border-border-subtle px-4 py-3 last:border-b-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-xs font-semibold text-yellow-600">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={name}
            className="h-10 w-10 rounded-xl object-cover"
          />
        ) : (
          getInitials(name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-text-primary">
            {name}
          </p>

          <div className="flex shrink-0 items-center gap-0.5">
            <FaStar className="text-[10px] text-yellow-500" />

            <span className="text-xs font-medium text-text-secondary">
              {review?.rating || 0}
            </span>
          </div>
        </div>

        <p className="mt-0.5 truncate text-xs text-text-muted">
          {tour?.title || "Tour"}
        </p>

        {review?.comment && (
          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Dashboard = () => {
  const { data: response, isLoading, isError, refetch } = useEmployeeDashboard();

  const stats = response?.data || {};

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (isLoading && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-yellow-500" />

          <p className="text-sm text-text-muted">Loading your dashboard...</p>
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
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Something went wrong while loading your dashboard.
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

  const recentBookings = stats.recentBookings || [];
  const recentReviews = stats.recentReviews || [];

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

          <span className="badge-yellow">Dashboard</span>
        </div>

        <h1 className="mt-1 text-3xl font-semibold text-text-primary">
          Overview
        </h1>

        <p className="mt-1 max-w-xl text-sm text-text-muted">
          A quick summary of your tours, bookings, and performance.
        </p>
      </div>

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tours"
          value={formatNumber(stats.totalTours)}
          icon={FaMountain}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <StatCard
          title="Total Bookings"
          value={formatNumber(stats.totalBookings)}
          icon={FaTicketAlt}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Average Rating"
          value={stats.averageRating || 0}
          subtitle="Out of 5.0"
          icon={FaStar}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Total Reviews"
          value={formatNumber(stats.totalReviews)}
          icon={FaComments}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* ==================================================
          RECENT BOOKINGS
      ================================================== */}

      <div className="rounded-2xl border border-border-subtle bg-bg-card">
        <div className="border-b border-border-subtle px-5 py-4">
          <SectionHeader
            title="Recent Bookings"
            subtitle="Latest bookings made on your tours"
            linkTo="/employee/bookings"
            linkLabel="View all"
          />
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FaTicketAlt size={18} />
            </div>

            <p className="mt-2 text-sm font-medium text-text-primary">
              No bookings yet
            </p>

            <p className="text-xs text-text-muted">
              New bookings on your tours will show up here.
            </p>
          </div>
        ) : (
          <div>
            {recentBookings.map((booking) => (
              <RecentBookingRow
                key={booking._id || booking.id}
                booking={booking}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==================================================
          RECENT REVIEWS
      ================================================== */}

      <div className="rounded-2xl border border-border-subtle bg-bg-card">
        <div className="border-b border-border-subtle px-5 py-4">
          <SectionHeader
            title="Recent Reviews"
            subtitle="What travelers are saying about your tours"
            linkTo="/employee/reviews"
            linkLabel="View all"
          />
        </div>

        {recentReviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FaComments size={18} />
            </div>

            <p className="mt-2 text-sm font-medium text-text-primary">
              No reviews yet
            </p>

            <p className="text-xs text-text-muted">
              Reviews on your tours will show up here.
            </p>
          </div>
        ) : (
          <div>
            {recentReviews.map((review) => (
              <RecentReviewRow key={review._id || review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
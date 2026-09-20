// src/pages/employee/Reviews.jsx

import React, { useState } from "react";
import {
  FaStar,
  FaComments,
} from "react-icons/fa";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Star,
} from "lucide-react";

import {
  useMyTourReviews,
  useRatingStats,
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
// STAR RATING
// ======================================================

const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={
            star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({ title, value, icon: Icon, iconClass, subtitle }) => {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          )}
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
// REVIEW CARD
// ======================================================

const ReviewCard = ({ review }) => {
  const user = review?.user || {};
  const tour = review?.tour || {};

  const name = user?.name || "Traveler";

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-xs font-semibold text-yellow-600">
            {user?.avatar ? (
              <img
                src={user.avatar}
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
              {formatDate(review?.createdAt)}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <StarRating rating={review?.rating || 0} />
        </div>
      </div>

      {/* TOUR */}

      {tour?.title && (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
          <p className="truncate text-xs font-medium text-text-secondary">
            {tour.title}
          </p>
        </div>
      )}

      {/* COMMENT */}

      {review?.comment && (
        <p className="mt-4 text-sm leading-6 text-text-secondary">
          {review.comment}
        </p>
      )}
    </div>
  );
};

// ======================================================
// RATING DISTRIBUTION BAR
// ======================================================

const RatingBar = ({ stars, count, percentage }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-12 shrink-0 items-center gap-1 text-xs text-text-secondary">
        <span className="font-medium">{stars}</span>
        <FaStar className="text-[10px] text-yellow-500" />
      </div>

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-yellow-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="w-14 shrink-0 text-right text-xs text-text-muted">
        {formatNumber(count)}
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Reviews = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  // ====================================================
  // QUERIES
  // ====================================================

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyTourReviews({
    page,
    limit,
    search,
    rating: ratingFilter === "all" ? undefined : ratingFilter,
  });

  const { data: statsResponse } = useRatingStats();

  // ====================================================
  // API DATA
  // ====================================================

  const reviews = response?.data || [];
  const meta = response?.meta || {};

  const ratingStats = statsResponse?.data || {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (isLoading && !response) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={30} className="animate-spin text-yellow-500" />

          <p className="text-sm text-text-muted">Loading reviews...</p>
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
            Unable to load reviews
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Something went wrong while loading your reviews.
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

          <span className="badge-yellow">Reviews</span>
        </div>

        <h1 className="mt-1 text-3xl font-semibold text-text-primary">
          Reviews
        </h1>

        <p className="mt-1 max-w-xl text-sm text-text-muted">
          See what travelers think about the tours you created.
        </p>
      </div>

      {/* ==================================================
          STATS + RATING DISTRIBUTION
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* AVERAGE + TOTAL */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard
            title="Average Rating"
            value={ratingStats.averageRating || 0}
            subtitle="Out of 5.0"
            icon={FaStar}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Total Reviews"
            value={formatNumber(ratingStats.totalReviews || 0)}
            icon={FaComments}
            iconClass="bg-yellow-50 text-yellow-600"
          />
        </div>

        {/* DISTRIBUTION */}

        <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-text-primary">
            Rating Distribution
          </h2>

          <div className="mt-4 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={ratingStats.distribution?.[stars] || 0}
                percentage={ratingStats.percentages?.[stars] || 0}
              />
            ))}
          </div>
        </div>
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
              placeholder="Search reviews..."
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
                  ["5", "5★"],
                  ["4", "4★"],
                  ["3", "3★"],
                  ["2", "2★"],
                  ["1", "1★"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRatingFilter(value);
                      setPage(1);
                    }}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium ${
                      ratingFilter === value
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
          EMPTY / REVIEW GRID
      ================================================== */}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-bg-card px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500">
            <FaComments size={22} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-text-primary">
            {search || ratingFilter !== "all"
              ? "No reviews found"
              : "No reviews yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            {search || ratingFilter !== "all"
              ? "Try changing your search or filter to find what you're looking for."
              : "Reviews on your tours will appear here once travelers leave feedback."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id || review.id} review={review} />
          ))}
        </div>
      )}

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {reviews.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            Showing{" "}
            <span className="font-medium text-text-secondary">
              {reviews.length}
            </span>{" "}
            review{reviews.length !== 1 ? "s" : ""}
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
                  : reviews.length < limit)
              }
              onClick={() => setPage((prev) => prev + 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border-subtle text-text-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
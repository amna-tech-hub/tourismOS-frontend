import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Clock3,
  Users,
  Banknote,
  Building2,
  Globe2,
} from "lucide-react";

const TourCard = ({
  tour,
  userRole,
  onView,
  onEdit,
  onDelete,
}) => {
  const isSuperAdmin =
    userRole === "super_admin";

  const status =
    tour?.status || "draft";

  const image =
    tour?.coverImage?.url ||
    tour?.images?.[0]?.url ||
    null;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border-subtle transition-all hover:shadow-md hover:ring-slate-300">

      {/* ==================================================
          COVER IMAGE
      ================================================== */}

      <div className="relative h-48 overflow-hidden bg-bg-tertiary">

        {image ? (
          <img
            src={image}
            alt={tour?.title || "Tour"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-10 w-10 text-text-muted" />
          </div>
        )}

        {/* STATUS */}

        <div className="absolute left-3 top-3">
          <span
            className={`badge-yellow ${
              status === "published"
                ? "bg-success-dark text-white"
                : "bg-orange-400 text-white"
            }`}
          >
            {status === "published"
              ? "Published"
              : "Draft"}
          </span>
        </div>

        {/* ==================================================
            COMPANY BADGE
            SUPER ADMIN ONLY
        ================================================== */}

        {isSuperAdmin && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm">

              {tour?.company ? (
                <>
                  <Building2 className="h-3.5 w-3.5" />

                  {tour.company.companyName ||
                    "Company"}
                </>
              ) : (
                <>
                  <Globe2 className="h-3.5 w-3.5" />

                  Platform Tour
                </>
              )}

            </span>
          </div>
        )}

      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="p-5">

        {/* TITLE */}

        <h3 className="line-clamp-1 font-serif text-lg font-bold text-text-primary">
          {tour?.title ||
            "Untitled Tour"}
        </h3>

        {/* ROUTE */}

        <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">

          <MapPin className="h-4 w-4 shrink-0" />

          <span className="truncate">
            {tour?.from || "—"} →{" "}
            {tour?.to || "—"}
          </span>

        </div>

        {/* ==================================================
            COMPANY NAME
            SUPER ADMIN ONLY
        ================================================== */}

        {isSuperAdmin && (
          <div className="mt-2 text-xs text-text-muted">

            <span className="font-medium text-text-secondary">
              Company:
            </span>{" "}

            {tour?.company?.companyName ||
              "Platform"}

          </div>
        )}

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mt-4 grid grid-cols-3 gap-2">

          {/* DURATION */}

          <div className="flex items-center gap-1.5 text-xs text-text-muted">

            <Clock3 className="h-3.5 w-3.5 shrink-0" />

            <span>
              {tour?.duration || 0} days
            </span>

          </div>

          {/* PARTICIPANTS */}

          <div className="flex items-center gap-1.5 text-xs text-text-muted">

            <Users className="h-3.5 w-3.5 shrink-0" />

            <span>
              {tour?.maxParticipants || 0}
            </span>

          </div>

          {/* PRICE */}

          <div className="flex items-center gap-1.5 text-xs text-text-muted">

            <Banknote className="h-3.5 w-3.5 shrink-0" />

            <span>
              $
              {Number(
                tour?.price || 0
              ).toLocaleString()}
            </span>

          </div>

        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="mt-5 flex items-center gap-2 border-t border-border-subtle pt-4">

          {/* VIEW */}

          <button
            type="button"
            onClick={() =>
              onView?.(tour)
            }
            className="flex-1 rounded-xl border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-secondary"
          >
            <Eye className="mr-1.5 inline h-4 w-4" />
            View
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              onEdit?.(tour)
            }
            className="flex-1 rounded-xl border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-secondary"
          >
            <Pencil className="mr-1.5 inline h-4 w-4" />
            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDelete?.(tour)
            }
            className="rounded-xl border border-error/20 px-4 py-2 text-sm font-medium text-error transition hover:bg-error/5"
            aria-label="Delete tour"
          >
            <Trash2 className="h-4 w-4" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default TourCard;
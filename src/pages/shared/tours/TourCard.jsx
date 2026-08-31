// TourCard.jsx (Updated)
import React from "react";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return (
    image.url ||
    image.secure_url ||
    image.src ||
    image.image?.url ||
    ""
  );
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
};

const TourCard = ({ tour, onViewDetails, onBook }) => {
  const coverImage = getImageUrl(tour?.coverImage);
  const rating = Number(tour?.ratingsAverage || 0);
  const locationBadge = tour?.to || tour?.from || "Destination";

  // Handle book button click
  const handleBook = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (onBook) {
      onBook(tour);
    }
  };

  return (
    <article
      onClick={() => onViewDetails?.(tour)}
      className="relative w-full h-[360px] rounded-2xl overflow-hidden group cursor-pointer bg-neutral-900 shadow-md border border-neutral-100/10"
    >
      {/* Background Image */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={tour?.title || "Tour Destination"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-800 text-xs">
          No image available
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Top Location Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-neutral-900">
          <MapPin size={13} className="text-neutral-700 shrink-0" />
          <span className="text-xs font-medium tracking-wide truncate max-w-[120px]">
            {locationBadge}
          </span>
        </div>
      </div>

      {/* Top Right - Book Button */}
      {onBook && (
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={handleBook}
            className="text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-white transition-colors shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
        </div>
      )}

      {/* Bottom Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col gap-1.5 text-white">
        {/* Title */}
        <h3 className="text-xl font-bold leading-tight tracking-tight line-clamp-1 drop-shadow-sm text-white!">
          {tour?.title || "Untitled Tour"}
        </h3>

        {/* Subtitle / Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
          {tour?.summary || tour?.description || `Explore ${locationBadge} with our exclusive guided experiences.`}
        </p>

        <span className="text-sm font-bold text-yellow-300">
          {formatCurrency(tour?.price)}
        </span>

        {/* Footer Info: Rating & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
            {tour?.ratingsQuantity && (
              <span className="text-neutral-400 font-normal">
                ({tour.ratingsQuantity})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1">
              <ArrowUpRight className="text-black" size={16} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
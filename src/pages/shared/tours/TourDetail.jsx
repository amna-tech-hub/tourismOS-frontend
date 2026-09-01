// TourDetail.jsx - Updated with consistent UI theme and booking functionality

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HelpCircle,
  Info,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  WalletCards,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  ShieldAlert,
  AlertTriangle,
  Mountain,
  Waves,
  Flame,
  Activity,
  Sparkles,
  Building2,
  User,
  Banknote,
  Globe2,
  Calendar,
  CreditCard,
  X,
  Loader2,
  ActivityIcon,
} from "lucide-react";
import { PenSquare, ThumbsUp, MessageCircle } from 'lucide-react';

import {
  useCheckTourSafety,
  useTourReviews,
  useCreateReview,
} from "../../../api/queries/useTraveler";
import { useCreateBooking, usePaymentRedirection } from "../../../api/queries/useBooking";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import MyMap from "../../../components/MyMap";

/* =========================================================
   HELPERS
========================================================= */

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

const getReviews = (data) => {
  return (
    data?.reviews ||
    data?.data?.reviews ||
    data?.data ||
    []
  );
};

const getSafetyConfig = (status) => {
  switch (status) {
    case "SAFE":
      return {
        label: "Safe to Travel",
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "WARNING":
      return {
        label: "Travel With Caution",
        icon: AlertTriangle,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
      };
    case "DANGER":
      return {
        label: "Travel Not Recommended",
        icon: ShieldAlert,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        dot: "bg-rose-500",
      };
    default:
      return {
        label: "Safety Information",
        icon: Info,
        color: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-200",
        badge: "bg-slate-100 text-slate-700",
        dot: "bg-slate-500",
      };
  }
};

/* =========================================================
   STAR RATING
========================================================= */

const Stars = ({ value = 0, size = 16 }) => {
  const rating = Number(value) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "text-yellow-400 fill-current"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
};

/* =========================================================
   SAFETY BADGE
========================================================= */

const SafetyBadge = ({ status }) => {
  const config = getSafetyConfig(status);
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

/* =========================================================
   WEATHER CARD
========================================================= */

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const items = [
    { label: "Temperature", value: `${weather.temperature ?? "—"}°C`, icon: CloudSun },
    { label: "Rain", value: `${weather.rain ?? "—"} mm`, icon: CloudRain },
    { label: "Wind", value: `${weather.wind ?? "—"} m/s`, icon: Wind },
    { label: "Humidity", value: `${weather.humidity ?? "—"}%`, icon: Droplets },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   DISASTER STATUS
========================================================= */

const DisasterItem = ({ label, active, icon: Icon }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${
      active ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          active ? "bg-rose-100" : "bg-emerald-100"
        }`}>
          <Icon className={`w-4 h-4 ${active ? "text-rose-500" : "text-emerald-500"}`} />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        active ? "bg-rose-200 text-rose-700" : "bg-emerald-200 text-emerald-700"
      }`}>
        {active ? "Active" : "Clear"}
      </span>
    </div>
  );
};

/* =========================================================
   ITINERARY DAY
========================================================= */
const ItineraryDay = ({ day, safety }) => {
  const [open, setOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Correctly extracts from day.coordinates: { latitude: ..., longitude: ... }
  const lat = day?.latitude;
  const lng = day?.longitude;
// TEMPORARY DEBUG LOG
 
  const safetyConfig = safety?.safety ? getSafetyConfig(safety.safety.status) : null;
  const SafetyIcon = safetyConfig?.icon || ShieldCheck;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-yellow-50/30 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-400 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {day.day}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">
              {day.title || `Day ${day.day}`}
            </h4>
            {day.location && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{day.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {safety?.safety?.status && (
            <SafetyBadge status={safety.safety.status} />
          )}
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      {open && (
        <div className="border-t border-slate-100 p-6 space-y-6 bg-yellow-50/20">
          
          {/* Map Section */}
          {lat && lng && (
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-slate-900">
                    Location Map ({day.location})
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500 transition-colors cursor-pointer"
                >
                  {showMap ? "Hide Map" : "View Map"}
                </button>
              </div>

              {showMap && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                  <MyMap lat={lat} lng={lng} locationName={day.location}/>
                </div>
              )}
            </div>

          )}

          {/* Description */}
          {day.description && (
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-sm leading-7 text-slate-600">
                {day.description}
              </p>
            </div>
          )}

          {/* Activities */}
          {day.activities?.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-yellow-500" />
                Activities
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {day.activities.map((activity, index) => {
                  const title = typeof activity === "string" ? activity : activity?.title || "Activity";
                  const image = typeof activity === "object" ? activity?.image : null;
                  const imageUrl = getImageUrl(image);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white transition-colors shadow-sm"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-24 h-24 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-slate-100">
                          <MapPin className="w-6 h-6 text-yellow-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700 leading-snug">
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weather & Safety */}
          {safety && (
            <div className="space-y-4">
              {safety.weather && (
                <div>
                  <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-blue-500" />
                    Weather Conditions
                  </h5>
                  <WeatherCard weather={safety.weather} />
                </div>
              )}

              {safety.disasters && (
                <div>
                  <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Safety Alerts
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <DisasterItem label="Flood" active={safety.disasters.flood} icon={Waves} />
                    <DisasterItem label="Earthquake" active={safety.disasters.earthquake} icon={Activity} />
                    <DisasterItem label="Landslide" active={safety.disasters.landslide} icon={Mountain} />
                    <DisasterItem label="Fire" active={safety.disasters.fire} icon={Flame} />
                  </div>
                </div>
              )}

              {safety.safety && safety.safety.reasons?.length > 0 && (
                <div className={`rounded-xl border p-4 ${safetyConfig.bg} ${safetyConfig.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${safetyConfig.bg}`}>
                      <SafetyIcon className={`w-5 h-5 ${safetyConfig.color}`} />
                    </div>
                    <div>
                      <h5 className={`font-semibold ${safetyConfig.color}`}>
                        {safetyConfig.label}
                      </h5>
                      <ul className="mt-1.5 space-y-1">
                        {safety.safety.reasons.map((reason, index) => (
                          <li key={index} className={`text-sm ${safetyConfig.color} flex items-start gap-2 opacity-90`}>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   REVIEW SLIDER
========================================================= */

const ReviewSlider = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 2;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  );

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">No reviews yet</h3>
        <p className="text-sm text-slate-500 mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 gap-4">
        {visibleReviews.map((review) => {
          const reviewer = review?.user?.name || review?.userName || review?.name || "Traveler";
          const rating = Number(review?.rating || 0);
          const text = review?.comment || review?.review || "";

          return (
            <div key={review?._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{reviewer}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars value={rating} size={14} />
                    <span className="text-xs text-slate-500">{rating.toFixed(1)}</span>
                  </div>
                </div>
                {review?.createdAt && (
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-7 mt-4">{text}</p>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-yellow-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-yellow-400" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-yellow-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   REVIEW FORM
========================================================= */

const ReviewForm = ({ tourId, isAuthenticated, isCheckingAuth, userHasReviewed }) => {
  const navigate = useNavigate();
  const createReviewMutation = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCheckingAuth) return;
    
    // Check if user has already reviewed this tour
    if (userHasReviewed) {
      toast.success("You've already reviewed this tour! You can only add one review per tour.");
      return;
    }
    
    if (!isAuthenticated) {
      navigate("/auth/register", {
        state: {
          from: `/tours/${tourId}`,
          message: "Please create an account to leave a review.",
        },
      });
      return;
    }
    if (!comment.trim() || rating === 0) return;

    try {
      await createReviewMutation.mutateAsync({
        tourId,
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Create Review Error:", error);
      // Check if error is because user already reviewed
      if (error?.response?.data?.message?.includes("already reviewed") || 
          error?.response?.data?.message?.includes("You have already reviewed")) {
        toast.success("You've already reviewed this tour! You can only add one review per tour.");
      }
    }
  };

  // If user has already reviewed, show a message instead of the form
  if (userHasReviewed && !submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <MessageSquare size={19} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Already Reviewed</h3>
            <p className="text-sm text-slate-500">You can only add one review per tour</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700">You've Already Reviewed This Tour!</p>
          <p className="text-sm text-yellow-600 mt-1">Thank you for sharing your experience. You can only submit one review per tour.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
          <MessageSquare size={19} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Share Your Experience</h3>
          <p className="text-sm text-slate-500">Help other travelers make better decisions</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-emerald-700">Review Submitted!</p>
          <p className="text-sm text-emerald-600">Thank you for sharing your experience.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Rate Your Experience</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={
                      value <= (hoverRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm font-medium text-slate-500 ml-2">
                  {rating === 5 ? "Excellent!" : rating >= 4 ? "Great!" : rating >= 3 ? "Good" : rating >= 2 ? "Okay" : "Needs improvement"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience with this tour..."
              className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={createReviewMutation.isPending || !comment.trim() || rating === 0}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>

          {createReviewMutation.isError && (
            <p className="text-sm text-rose-500 mt-3">Failed to submit review. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
};

/* =========================================================
   BOOKING MODAL
========================================================= */

const BookingModal = ({ 
  tour, 
  isOpen, 
  onClose, 
  onConfirm,
  isProcessing,
  error: externalError
}) => {
  const [participants, setParticipants] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [provider, setProvider] = useState("stripe");
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalError) {
      const errorMessage = 
        externalError?.response?.data?.message ||
        externalError?.response?.data?.error?.message ||
        externalError?.message ||
        "Unable to create your booking. Please try again.";
      setError(errorMessage);
    } else {
      setError("");
    }
  }, [externalError]);

  useEffect(() => {
    if (isOpen) {
      setParticipants(1);
      setTravelDate("");
      setProvider("stripe");
      setError("");
    }
  }, [isOpen, tour?._id]);

  if (!isOpen || !tour) return null;

  const totalAmount = tour.price * participants;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!travelDate) {
      setError("Please select a travel date");
      return;
    }
    
    if (!participants || participants < 1) {
      setError("Please enter at least 1 traveler.");
      return;
    }

    if (tour.maxParticipants && Number(participants) > Number(tour.maxParticipants)) {
      setError(`This tour allows a maximum of ${tour.maxParticipants} travelers.`);
      return;
    }

    onConfirm({
      tourId: tour._id,
      participants: Number(participants),
      travelDate,
      provider
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Book Tour</h2>
            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{tour.title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-slate-100 rounded-xl transition"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-700">Booking unavailable</p>
                <p className="text-sm text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Tour Price Display */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Price per person</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(tour.price)}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Users size={16} className="inline mr-2" />
              Number of Travelers
            </label>
            <input
              type="number"
              min="1"
              max={tour.maxParticipants || 10}
              value={participants}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setParticipants(isNaN(value) ? "" : Math.max(1, value));
                setError("");
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
              required
            />
            {tour.maxParticipants && (
              <p className="text-xs text-slate-400 mt-1">
                Max {tour.maxParticipants} travelers allowed
              </p>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Calendar size={16} className="inline mr-2" />
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => {
                setTravelDate(e.target.value);
                setError("");
              }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
              required
            />
          </div>

          {/* Payment Provider */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <CreditCard size={16} className="inline mr-2" />
              Payment Method
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
            >
              <option value="stripe">Stripe (Credit/Debit Card)</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          {/* Total */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Total Amount</span>
              <span className="text-2xl font-bold text-yellow-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-white font-medium transition disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN DETAIL PAGE
========================================================= */

export default function TourDetail() {
  const navigate = useNavigate();
  const { id: tourId } = useParams();
  const { isAuthenticated, isCheckingAuth, user } = useAuth();

  // Booking state
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking hooks
  const createBookingMutation = useCreateBooking();
  const { redirectToPayment, isProcessing: isPaymentProcessing } = usePaymentRedirection();

  const {
    mutate: checkTourSafety,
    data: safetyResponse,
    isPending,
    isError,
    error,
  } = useCheckTourSafety();

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
  } = useTourReviews(tourId);

  useEffect(() => {
    if (!tourId) return;
    checkTourSafety({ id: tourId });
  }, [tourId, checkTourSafety]);

  const data = safetyResponse?.data;
  const tour = data?.tour || data?.data?.tour || null;
  const dailySafety = data?.dailySafety || data?.data?.dailySafety || null;

  const reviews = useMemo(() => getReviews(reviewsData), [reviewsData]);
console.log(data,"data",tour,"tour",dailySafety,"dailysafety");

  // Check if current user has already reviewed this tour
  const userHasReviewed = useMemo(() => {
    if (!user || !reviews.length) return false;
    return reviews.some(review => 
      review.user?._id === user._id || 
      review.userId === user._id ||
      review.user === user._id
    );
  }, [reviews, user]);

  const coverImage = getImageUrl(tour?.coverImage);
  const galleryImages = useMemo(() => {
    const images = Array.isArray(tour?.images)
      ? tour.images.map(getImageUrl).filter(Boolean)
      : [];
    const all = [coverImage, ...images].filter(Boolean);
    return [...new Set(all)];
  }, [tour, coverImage]);
  const safetySummary = useMemo(() => {
    if (!dailySafety?.length) return { safe: 0, warning: 0, danger: 0 };
    return dailySafety.reduce(
      (acc, day) => {
        const status = day?.safety?.status;
        if (status === "SAFE") acc.safe += 1;
        else if (status === "WARNING") acc.warning += 1;
        else if (status === "DANGER") acc.danger += 1;
        return acc;
      },
      { safe: 0, warning: 0, danger: 0 }
    );
  }, [dailySafety]);

  // =========================================================
  // BOOKING HANDLERS (same as Home page)
  // =========================================================

  const handleBook = (tour) => {
    if (!isAuthenticated) {
      navigate("/auth/register", {
        state: {
          from: `/tours/${tourId}`,
          message: "Create an account to book this tour.",
        },
      });
      return;
    }
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      const cleanBookingData = {
        tourId: bookingData.tourId,
        participants: Number(bookingData.participants),
        travelDate: bookingData.travelDate,
        provider: bookingData.provider || 'stripe',
      };
      
      const response = await createBookingMutation.mutateAsync(cleanBookingData);
      
      toast.success("Booking created! Redirecting to payment...");
      
      const result = await redirectToPayment(response);
      
      if (result?.success && result?.method === 'manual') {
        toast.success("Booking confirmed successfully!");
        navigate(`/dashboard/bookings`);
      }
      
      setIsModalOpen(false);
      setSelectedTour(null);
      
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error?.response?.data?.message || 
                           error?.message || 
                           "Booking failed";
      toast.error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    if (!createBookingMutation.isPending && !isPaymentProcessing) {
      setIsModalOpen(false);
      setSelectedTour(null);
    }
  };
const [showReviewForm, setShowReviewForm] = useState(false);

  const isProcessing = createBookingMutation.isPending || isPaymentProcessing;

  // =========================================================
  // RENDER
  // =========================================================

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-8 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="h-[400px] bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 text-center max-w-lg shadow-sm border border-slate-100">
          <Info size={38} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Tour Unavailable</h1>
          <p className="text-slate-600 mt-2">
            {error?.response?.data?.message || "We couldn't load this tour. Please try again."}
          </p>
          <button
            onClick={() => navigate("/tours")}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  const rating = Number(tour.ratingsAverage || 0);
  return (
    <div className="min-h-screen bg-slate-50 max-w-7xl mx-auto  pb-10 px-4 sm:px-6 md:px-7 px-4 sm:px-6 lg:px-8 py-6 my-4 space-y-7">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={17} />
          Back to tours
        </button>
      </div>

 <section className="mx-auto px-2 sm:px-3 lg:px-4">
  <div className="grid lg:grid-cols-2 gap-10">
    {/* Left Column - Details */}
    <div className="space-y-5">
      {/* Title with first letter capitalized */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
        {tour.title.charAt(0).toUpperCase() + tour.title.slice(1)}
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div>
          <Clock3 size={22} className="text-yellow-400" />
          <p className="text-xs text-slate-500 mt-2">Duration</p>
          <p className="font-semibold text-slate-900 text-lg mt-0.5">
            {tour.duration} {Number(tour.duration) === 1 ? "day" : "days"}
          </p>
        </div>
        <div>
          <CalendarDays size={22} className="text-yellow-400" />
          <p className="text-xs text-slate-500 mt-2">Best Time</p>
          <p className="font-semibold text-slate-900 text-lg mt-0.5">
            {tour.bestTimeToVisit || "Anytime"}
          </p>
        </div>
        <div>
          <Users size={22} className="text-yellow-400" />
          <p className="text-xs text-slate-500 mt-2">Group Size</p>
          <p className="font-semibold text-slate-900 text-lg mt-0.5">
            Up to {tour.maxParticipants || "—"}
          </p>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <div className="flex items-center gap-2">
          <Stars value={rating} size={20} />
          <span className="font-semibold text-slate-900">{rating.toFixed(1)}</span>
        </div>
        <span className="text-slate-500 text-sm">
          {tour.ratingsQuantity || 0} {tour.ratingsQuantity === 1 ? "review" : "reviews"}
        </span>
        <span className="w-px h-5 bg-slate-300" />
        <span className="text-sm text-slate-500">
          {tour.maxParticipants || 0} max travelers
        </span>
      </div>

      {/* Price & Book */}
      <div className="pt-2">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Tour Price</p>
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(tour.price)}
            </p>
            <p className="text-sm text-slate-500">per traveler</p>
          </div>
          <button
            onClick={() => handleBook(tour)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Book Now
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
          <ShieldCheck size={17} className="text-yellow-400" />
          Secure booking
        </div>
      </div>

      {/* Description */}
      <div className="pt-4 border-t border-slate-200/60">
        <h2 className="text-xl font-bold text-slate-900 mb-3">About This Tour</h2>
        <p className="text-slate-600 leading-8">{tour.description}</p>
      </div>
    </div>

    {/* Right Column - Gallery */}
    <div>
      {/* Check if there are 3 or more thumbnails */}
      {galleryImages.length >= 4 ? (
        // 3 or more thumbnails - Side layout
        <div className="flex gap-3">
          {/* Main Image */}
          {coverImage ? (
            <div className="relative flex-1 h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={coverImage}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative flex-1 h-[420px] lg:h-[500px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center text-slate-400">
                <MapPin size={48} className="mx-auto mb-2" />
                <p className="text-sm">No cover image</p>
              </div>
            </div>
          )}

          {/* Thumbnails Stack */}
          <div className="flex flex-col gap-3 w-24 lg:w-28">
            {galleryImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 shadow-sm"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : galleryImages.length >= 2 ? (
        // 1-2 thumbnails - Bottom layout
        <div className="space-y-3">
          {/* Main Image */}
          {coverImage ? (
            <div className="relative h-[320px] lg:h-[400px] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={coverImage}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-[320px] lg:h-[400px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center text-slate-400">
                <MapPin size={48} className="mx-auto mb-2" />
                <p className="text-sm">No cover image</p>
              </div>
            </div>
          )}

          {/* Thumbnails Grid at Bottom */}
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative h-[80px] lg:h-[100px] rounded-xl overflow-hidden bg-slate-100 shadow-sm"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Only cover image - No thumbnails
        <div>
          {coverImage ? (
            <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={coverImage}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-[420px] lg:h-[500px] rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center text-slate-400">
                <MapPin size={48} className="mx-auto mb-2" />
                <p className="text-sm">No cover image</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</section>

      {/* Itinerary with Safety */}
      {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Itinerary & Safety</h2>
              <p className="text-sm text-slate-500 mt-1">Daily plan with real-time safety updates</p>
            </div>
            {dailySafety?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {safetySummary.safe > 0 && (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {safetySummary.safe} Safe
                  </span>
                )}
                {safetySummary.warning > 0 && (
                  <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {safetySummary.warning} Warning
                  </span>
                )}
                {safetySummary.danger > 0 && (
                  <span className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {safetySummary.danger} Danger
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {tour.itinerary.map((day) => {
              const safety = dailySafety?.find((item) => item.day === day.day);
              return <ItineraryDay key={day._id || day.day} day={day} safety={safety} />;
            })}
          </div>
        </section>
      )}

      {/* Travel Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Travel Tips */}
          {Array.isArray(tour.travelTips) && tour.travelTips.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-4">Travel Tips</h3>
              <ul className="space-y-2 mt-3">
                {tour.travelTips.map((tip, index) => (
                  <li key={index} className="flex gap-2 text-sm text-slate-600">
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Notes */}
          {Array.isArray(tour.importantNotes) && tour.importantNotes.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Info size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-4">Important Notes</h3>
              <ul className="space-y-2 mt-3">
                {tour.importantNotes.map((note, index) => (
                  <li key={index} className="flex gap-2 text-sm text-slate-600 " >
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget Breakdown */}
          {tour.budgetBreakdown && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <WalletCards size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-4">Budget Breakdown</h3>
              <div className="space-y-2 mt-3">
                {Object.entries(tour.budgetBreakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500 capitalize">{key}</span>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {Array.isArray(tour.faqs) && tour.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 mt-1">Everything you need to know</p>
          </div>
          <div className="space-y-3">
            {tour.faqs.map((faq, index) => (
              <details
                key={faq._id || index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group"
              >
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-yellow-50/30 transition-colors">
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <p className="text-slate-600 leading-7">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}


{/* -------------------- */}
{/* Reviews Section */}
<section className="mx-auto px-2 sm:px-3 lg:px-4 py-8">
  <div className="space-y-6">
    {/* Section Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Traveler Reviews</h2>
        <p className="text-sm text-slate-500 mt-1">
          {tour.ratingsQuantity || 0} {tour.ratingsQuantity === 1 ? "review" : "reviews"}
        </p>
      </div>
      
      {isAuthenticated && (
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          {showReviewForm ? (
            <>
              <X size={18} />
              Close
            </>
          ) : (
            <>
              <PenSquare size={18} />
              Write Review
            </>
          )}
        </button>
      )}
    </div>

    {/* Review Form - Collapsible */}
    {showReviewForm && (
      <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <ReviewForm
          tourId={tourId}
          isAuthenticated={isAuthenticated}
          isCheckingAuth={isCheckingAuth}
          userHasReviewed={userHasReviewed}
        />
      </div>
    )}

    {/* Reviews */}
    <div>
      {reviewsLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4 mt-2" />
              <div className="h-16 bg-slate-200 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                    {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : ''}
                    </p>
                  </div>
                </div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  <Stars value={review.rating} size={16} />
                </div>
              </div>

              {/* Review Content */}
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {review.comment || 'No comment provided.'}
              </p>

              {/* Review Footer - Optional */}
              <div className="mt-3 pt-3 border-t border-slate-100">
               
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</section>

      {/* Booking Modal */}
      <BookingModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
        isProcessing={isProcessing}
        error={createBookingMutation.error}
      />
    </div>
  );
}
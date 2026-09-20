// TourDetail.jsx - Wrapped roadmap, separated info cards, white bg everywhere

import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
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
  Calendar,
  CreditCard,
  X,
  Loader2,
  ActivityIcon,
} from "lucide-react";
import { PenSquare } from 'lucide-react';

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
        bg: "bg-white",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "WARNING":
      return {
        label: "Travel With Caution",
        icon: AlertTriangle,
        color: "text-yellow-600",
        bg: "bg-white",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
      };
    case "DANGER":
      return {
        label: "Travel Not Recommended",
        icon: ShieldAlert,
        color: "text-rose-600",
        bg: "bg-white",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        dot: "bg-rose-500",
      };
    default:
      return {
        label: "Safety Information",
        icon: Info,
        color: "text-slate-600",
        bg: "bg-white",
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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white ${config.border} border`}>
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
          <div key={item.label} className="bg-white p-3">
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
    <div className={`flex items-center justify-between p-3 rounded-xl border bg-white ${
      active ? "border-rose-200" : "border-emerald-200"
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white`}>
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

  const lat = day?.latitude;
  const lng = day?.longitude;

  const safetyConfig = safety?.safety ? getSafetyConfig(safety.safety.status) : null;
  const SafetyIcon = safetyConfig?.icon || ShieldCheck;

  return (
    <div className="bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 hover:bg-yellow-50/30 transition-colors text-left bg-white"
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

      {open && (
        <div className="pl-16 pr-4 pb-6 space-y-6 bg-white">

          {lat && lng && (
            <div className="bg-white">
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
                <div className="mt-4 rounded-xl overflow-hidden">
                  <MyMap lat={lat} lng={lng} locationName={day.location}/>
                </div>
              )}
            </div>
          )}

          {day.description && (
            <div className="bg-white">
              <p className="text-sm leading-7 text-slate-600">
                {day.description}
              </p>
            </div>
          )}

          {day.activities?.length > 0 && (
            <div className="bg-white">
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
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-24 h-24 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-white">
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

          {safety && (
            <div className="space-y-4 bg-white">
              {safety.weather && (
                <div className="bg-white">
                  <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-blue-500" />
                    Weather Conditions
                  </h5>
                  <WeatherCard weather={safety.weather} />
                </div>
              )}

              {safety.disasters && (
                <div className="bg-white">
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
                <div className={`rounded-xl border p-4 bg-white ${safetyConfig.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white`}>
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
      if (error?.response?.data?.message?.includes("already reviewed") ||
          error?.response?.data?.message?.includes("You have already reviewed")) {
        toast.success("You've already reviewed this tour! You can only add one review per tour.");
      }
    }
  };

  if (userHasReviewed && !submitted) {
    return (
      <div className="bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white text-yellow-600 flex items-center justify-center">
            <MessageSquare size={19} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Already Reviewed</h3>
            <p className="text-sm text-slate-500">You can only add one review per tour</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="font-semibold text-yellow-700">You've Already Reviewed This Tour!</p>
          <p className="text-sm text-yellow-600 mt-1">Thank you for sharing your experience. You can only submit one review per tour.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white text-yellow-600 flex items-center justify-center">
          <MessageSquare size={19} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Share Your Experience</h3>
          <p className="text-sm text-slate-500">Help other travelers make better decisions</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-xl p-4 text-center">
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
              className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-sm bg-white"
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
        <div className="flex items-center justify-between p-6 bg-white">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-white px-4 py-3">
              <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-700">Booking unavailable</p>
                <p className="text-sm text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Price per person</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(tour.price)}
              </span>
            </div>
          </div>

          <div className="bg-white">
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition bg-white"
              required
            />
            {tour.maxParticipants && (
              <p className="text-xs text-slate-400 mt-1">
                Max {tour.maxParticipants} travelers allowed
              </p>
            )}
          </div>

          <div className="bg-white">
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition bg-white"
              required
            />
          </div>

          <div className="bg-white">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <CreditCard size={16} className="inline mr-2" />
              Payment Method
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition bg-white"
            >
              <option value="stripe">Stripe (Credit/Debit Card)</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          <div className="pt-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Total Amount</span>
              <span className="text-2xl font-bold text-yellow-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white transition disabled:opacity-50 bg-white"
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

  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (isPending) {
    return (
      <div className="min-h-screen bg-white">
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
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 text-center max-w-lg">
          <Info size={38} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Tour Unavailable</h1>
          <p className="text-slate-600 mt-2">
            {error?.response?.data?.message || "We couldn't load this tour. Please try again."}
          </p>
          <button
            onClick={() => navigate("/")}
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
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 pb-16 bg-white">

        {/* Back Button */}
        <div className="mt-6 bg-white">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center mt-8 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={17} />
            Back to tours
          </button>
        </div>

        <section className="mt-4 bg-white">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* LEFT COLUMN */}
            <div className="bg-white rounded-2xl border border-slate-100  ">

              {/* TITLE */}
              <div className="bg-white">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {tour.title.charAt(0).toUpperCase() + tour.title.slice(1)}
                </h1>

                
              </div>
   {/* PRICE + BOOKING */}
             <div className="bg-white">
  <div className="flex flex-col gap-5">
    {/* Price + Max Travelers on one line */}
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <div>
        <span className="text-sm text-slate-800">Tour Price{"  "} </span>
        <span className="text-2xl  text-yellow-400 mt-1">
          {formatCurrency(tour.price)}
        </span>
        <span className="text-sm text-slate-800 mt-1">{" "}per traveler</span>
      </div>

    </div>

  
  </div>
</div>
              {/* TOUR ROADMAP */}
              {tour.itinerary?.length > 0 && (
                <div className="mt-1 bg-white">
                  <div className="mb-5 bg-white">
                   
                    <p className="text-lg text-slate-800 mt-1">
                      Your journey at a glance
                    </p>
                  </div>

               {/* DESKTOP / TABLET ROADMAP - wraps automatically */}
<div className="hidden sm:block bg-white">
  <div className="flex flex-wrap gap-y-8">
    {tour.itinerary.map((day, index) => {
      const ITEMS_PER_ROW = 4;
      const isLastInRow = (index + 1) % ITEMS_PER_ROW === 0;
      const isVeryLast = index === tour.itinerary.length - 1;
      const showLine = !isLastInRow && !isVeryLast;

      return (
        <div
          key={day._id || day.day}
          className="relative flex flex-col items-center"
          style={{ width: "25%" }}
        >
          {/* Connecting line: hidden on last item of each row and on very last item */}
          {showLine && (
            <div className="absolute top-6 left-1/2 w-full border-t-2 border-dashed border-yellow-300" />
          )}

          <div className="relative z-10 w-12 h-12 rounded-full bg-yellow-400 border-4 border-white shadow-sm flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {day.day}
            </span>
          </div>

          <div className="text-center mt-3 px-1">
            <div className="flex justify-center items-center gap-1">
              <MapPin size={15} className="text-yellow-500 shrink-0" />
              <h3 className="font-semibold text-slate-900 text-sm">
                {day.location || "Location"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Day {day.day}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>

{/* MOBILE ROADMAP */}
<div className="sm:hidden bg-white">
  <div className="relative">
    <div className="absolute left-[23px] top-6 bottom-6 border-l-2 border-dashed border-yellow-300" />
    <div className="space-y-6">
      {tour.itinerary.map((day) => (
        <div
          key={day._id || day.day}
          className="relative flex items-center gap-4"
        >
          <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-yellow-400 border-4 border-white shadow-sm flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {day.day}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500">
              Day {day.day}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={15} className="text-yellow-500" />
              <h3 className="font-semibold text-slate-900">
                {day.location || "Location"}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
                </div>
              )}

           <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Stars value={rating} size={20} className="text-yellow-400"/>
                    <span className="font-semibold text-slate-900">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="w-px h-5" />
                  <span className="text-sm text-slate-500">
                  </span>
                </div>
  {/* Book Now button on next line */}
    <button
      onClick={() => handleBook(tour)}
      className="px-6 py-2.5 mt-3 bg-gradient-to-r from-yellow-400 to-yellow-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start"
    >
      Book Now
      <ArrowRight size={18} />
    </button>
              {/* ABOUT TOUR */}
              <div className="pt-2 mt-6 bg-white ">
                <h1 className="text-xl font-bold text-slate-900 mb-3">
                  About This Tour
                </h1>
                <p className="text-slate-600 leading-8">
                  {tour.description}
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN - GALLERY */}
            <div className="bg-white">
              {galleryImages.length >= 4 ? (
                <div className="flex gap-3">
                  {coverImage ? (
                    <div className="relative flex-1 h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-white shadow-sm">
                      <img
                        src={coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative flex-1 h-[420px] lg:h-[500px] rounded-2xl bg-white flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <MapPin size={48} className="mx-auto mb-2" />
                        <p className="text-sm">No cover image</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 w-24 lg:w-28">
                    {galleryImages.slice(1, 5).map((image, index) => (
                      <div
                        key={index}
                        className="relative flex-1 rounded-xl overflow-hidden bg-white shadow-sm"
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
                <div className="space-y-3 bg-white">
                  {coverImage ? (
                    <div className="relative h-[320px] lg:h-[400px] rounded-2xl overflow-hidden bg-white shadow-sm">
                      <img
                        src={coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-[320px] lg:h-[400px] rounded-2xl bg-white flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <MapPin size={48} className="mx-auto mb-2" />
                        <p className="text-sm">No cover image</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {galleryImages.slice(1, 3).map((image, index) => (
                      <div
                        key={index}
                        className="relative h-[80px] lg:h-[100px] rounded-xl overflow-hidden bg-white shadow-sm"
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
                <div className="bg-white">
                  {coverImage ? (
                    <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-white shadow-sm">
                      <img
                        src={coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-[420px] lg:h-[500px] rounded-2xl bg-white flex items-center justify-center">
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
          <section className="py-8 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white">
              <div className="bg-white">
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

            <div className="space-y-4 bg-white">
              {tour.itinerary.map((day) => {
                const safety = dailySafety?.find((item) => item.day === day.day);
                return <ItineraryDay key={day._id || day.day} day={day} safety={safety} />;
              })}
            </div>
          </section>
        )}

        {/* Travel Information */}
        <section className="py-8 bg-white">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
            {Array.isArray(tour.travelTips) && tour.travelTips.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
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

            {Array.isArray(tour.importantNotes) && tour.importantNotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-4">Important Notes</h3>
                <ul className="space-y-2 mt-3">
                  {tour.importantNotes.map((note, index) => (
                    <li key={index} className="flex gap-2 text-sm text-slate-600">
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tour.budgetBreakdown && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
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
          <section className="max-w-4xl mx-auto py-8 bg-white">
            <div className="text-center mb-8 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500 mt-1">Everything you need to know</p>
            </div>
            <div className="space-y-3 bg-white">
              {tour.faqs.map((faq, index) => (
                <details
                  key={faq._id || index}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden group"
                >
                  <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-yellow-50/30 transition-colors bg-white">
                    <span className="font-semibold text-slate-800">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 pt-2 bg-white">
                    <p className="text-slate-600 leading-7">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="py-8 bg-white">
          <div className="space-y-6 bg-white">
            <div className="flex items-center justify-between bg-white">
              <div className="bg-white">
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

            {showReviewForm && (
              <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 p-6">
                <ReviewForm
                  tourId={tourId}
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  userHasReviewed={userHasReviewed}
                />
              </div>
            )}

            <div className="bg-white">
              {reviewsLoading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
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
                      className="bg-white rounded-2xl border border-slate-100 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
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
                        <div className="flex items-center gap-1">
                          <Stars value={review.rating} size={16} />
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {review.comment || 'No comment provided.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

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
import React, { useEffect, useMemo } from "react";
import {
  X,
  MapPin,
  CalendarDays,
  Users,
  Banknote,
  Clock3,
  Star,
  Building2,
  Globe2,
  User,
  CheckCircle2,
  AlertTriangle,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  ShieldCheck,
  ShieldAlert,
  Mountain,
  Waves,
  Flame,
  Activity,
  Hotel,
  Utensils,
  Car,
  Sparkles,
  Info,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  CircleX,
  Sun,
  Cloud,
  CloudLightning,
  Thermometer,
  Droplet,
  Wind as WindIcon,
  Eye,
} from "lucide-react";

import { useCheckTourSafety } from "../../../api/queries/useTraveler";

/* ============================================================
   HELPERS
============================================================ */

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString();
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ============================================================
   SAFETY STATUS
============================================================ */

const getSafetyConfig = (status) => {
  switch (status) {
    case "SAFE":
      return {
        label: "Safe to Travel",
        icon: CheckCircle2,
        container: "bg-emerald-50/80 border-emerald-200",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        text: "text-emerald-800",
        badge: "bg-emerald-100 text-emerald-700",
        gradient: "from-emerald-50 to-emerald-100/30",
      };
    case "WARNING":
      return {
        label: "Travel With Caution",
        icon: AlertTriangle,
        container: "bg-amber-50/80 border-amber-200",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        text: "text-amber-800",
        badge: "bg-amber-100 text-amber-700",
        gradient: "from-amber-50 to-amber-100/30",
      };
    case "DANGER":
      return {
        label: "Travel Not Recommended",
        icon: ShieldAlert,
        container: "bg-red-50/80 border-red-200",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        text: "text-red-800",
        badge: "bg-red-100 text-red-700",
        gradient: "from-red-50 to-red-100/30",
      };
    default:
      return {
        label: "Safety Information",
        icon: Info,
        container: "bg-slate-50/80 border-slate-200",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        text: "text-slate-800",
        badge: "bg-slate-100 text-slate-700",
        gradient: "from-slate-50 to-slate-100/30",
      };
  }
};

/* ============================================================
   WEATHER CARD
============================================================ */

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <div className="text-sm text-slate-400 py-2">
        Weather information unavailable.
      </div>
    );
  }

  const weatherItems = [
    { label: "Temperature", value: `${weather.temperature ?? "—"}°C`, icon: Thermometer, color: "sky" },
    { label: "Rain", value: `${weather.rain ?? "—"} mm`, icon: CloudRain, color: "blue" },
    { label: "Wind", value: `${weather.wind ?? "—"} m/s`, icon: WindIcon, color: "slate" },
    { label: "Humidity", value: `${weather.humidity ?? "—"}%`, icon: Droplet, color: "indigo" },
  ];

  const colorMap = {
    sky: "bg-sky-50 border-sky-100 text-sky-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {weatherItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-2xl border p-4 ${colorMap[item.color]} transition-all hover:shadow-md hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                {item.label}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================
   DISASTER STATUS
============================================================ */

const DisasterItem = ({ label, active, icon: Icon }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
        active
          ? "bg-red-50/80 border-red-200 shadow-sm"
          : "bg-emerald-50/60 border-emerald-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            active ? "bg-red-100" : "bg-emerald-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${active ? "text-red-500" : "text-emerald-500"}`}
          />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
          active
            ? "bg-red-200 text-red-700"
            : "bg-emerald-200 text-emerald-700"
        }`}
      >
        {active ? (
          <>
            <CircleAlert className="w-3.5 h-3.5" />
            Active
          </>
        ) : (
          <>
            <CircleCheck className="w-3.5 h-3.5" />
            Clear
          </>
        )}
      </span>
    </div>
  );
};

/* ============================================================
   ITINERARY DAY
============================================================ */

const ItineraryDay = ({ day, safety }) => {
  const [open, setOpen] = React.useState(false);

  const safetyConfig = getSafetyConfig(safety?.safety?.status);
  const SafetyIcon = safetyConfig.icon;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Day Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50/70 transition-all text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {day.day}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">
              {day.title || `Day ${day.day}`}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>{day.location || "Location unavailable"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {safety?.safety?.status && (
            <span
              className={`hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${safetyConfig.badge}`}
            >
              <SafetyIcon className="w-4 h-4" />
              {safetyConfig.label}
            </span>
          )}
          <ChevronDown
            className={`w-6 h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Day Content */}
      {open && (
        <div className="border-t border-slate-100 p-6 space-y-6 bg-slate-50/30">
          {/* Description */}
          {day.description && (
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="text-sm leading-7 text-slate-600">
                {day.description}
              </p>
            </div>
          )}

          {/* Activities */}
          {day.activities?.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Activities
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {day.activities.map((activity) => (
                  <div
                    key={activity._id || activity.title}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all hover:border-amber-200"
                  >
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-amber-600" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-700">
                      {activity.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weather */}
          {safety && (
            <div>
              <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-sky-500" />
                Weather Conditions
              </h5>
              <WeatherCard weather={safety.weather} />
            </div>
          )}

          {/* Disaster */}
          {safety?.disasters && (
            <div>
              <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Regional Safety Alerts
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DisasterItem label="Flood" active={safety.disasters.flood} icon={Waves} />
                <DisasterItem
                  label="Earthquake"
                  active={safety.disasters.earthquake}
                  icon={Activity}
                />
                <DisasterItem
                  label="Landslide"
                  active={safety.disasters.landslide}
                  icon={Mountain}
                />
                <DisasterItem label="Fire" active={safety.disasters.fire} icon={Flame} />
              </div>
            </div>
          )}

          {/* Safety Reason */}
          {safety?.safety && (
            <div
              className={`rounded-2xl border-2 p-5 ${safetyConfig.container} bg-gradient-to-br ${safetyConfig.gradient}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${safetyConfig.iconBg}`}
                >
                  <SafetyIcon className={`w-6 h-6 ${safetyConfig.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h5 className={`font-bold text-lg ${safetyConfig.text}`}>
                    {safetyConfig.label}
                  </h5>
                  {safety.safety.reasons?.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {safety.safety.reasons.map((reason, index) => (
                        <li key={index} className={`text-sm ${safetyConfig.text} flex items-start gap-2`}>
                          <span className="mt-1.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({ icon: Icon, label, value, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const TourDetails = ({ isOpen, onClose, tourId }) => {
  const {
    mutate: checkTourSafety,
    data: safetyResponse,
    isPending,
    isError,
    error,
  } = useCheckTourSafety();

  /* ============================================================
     FETCH TOUR DETAILS + SAFETY
  ============================================================ */

  useEffect(() => {
    if (!isOpen || !tourId) return;
    checkTourSafety({ id: tourId });
  }, [isOpen, tourId, checkTourSafety]);

  /* ============================================================
     DATA
  ============================================================ */

  const data = safetyResponse?.data;
  const tourData = data?.tour || null;
  const dailySafety = data?.dailySafety || [];

  /* ============================================================
     SAFETY SUMMARY
  ============================================================ */

  const safetySummary = useMemo(() => {
    if (!dailySafety.length) {
      return { safe: 0, warning: 0, danger: 0 };
    }
    return dailySafety.reduce(
      (acc, day) => {
        const status = day?.safety?.status;
        if (status === "SAFE") acc.safe += 1;
        if (status === "WARNING") acc.warning += 1;
        if (status === "DANGER") acc.danger += 1;
        return acc;
      },
      { safe: 0, warning: 0, danger: 0 }
    );
  }, [dailySafety]);

  if (!isOpen) return null;

  const coverImage =
    tourData?.coverImage?.url || tourData?.images?.[0]?.url || null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900">Tour Details</h2>
              <p className="text-sm text-slate-500">Complete itinerary & safety info</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="overflow-y-auto flex-1">
          {/* ==================================================
              COVER
          ================================================== */}

          <div className="relative h-72 sm:h-80 bg-slate-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={tourData?.title || "Tour"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                <MapPin className="w-20 h-20 text-slate-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5 ${
                  tourData?.status === "published"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {tourData?.status === "published" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Published
                  </>
                ) : (
                  <>
                    <CircleAlert className="w-4 h-4" />
                    Draft
                  </>
                )}
              </span>
            </div>

            {/* Title & Location */}
            <div className="absolute bottom-6 left-8 right-8 text-white!">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white!">
                {tourData?.title || "Untitled Tour"}
              </h1>
              <div className="flex items-center gap-3 mt-3 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {tourData?.from || "—"} → {tourData?.to || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* =================================================
                BASIC STATS
            ================================================= */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Clock3}
                label="Duration"
                value={`${tourData?.duration || 0} Days`}
                color="amber"
              />
              <StatCard
                icon={Users}
                label="Max Participants"
                value={tourData?.maxParticipants || 0}
                color="blue"
              />
              <StatCard
                icon={Banknote}
                label="Tour Price"
                value={`PKR ${formatCurrency(tourData?.price)}`}
                color="emerald"
              />
              <StatCard
                icon={Star}
                label="Rating"
                value={`${tourData?.ratingsAverage || 0} ★`}
                color="purple"
              />
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                About This Tour
              </h3>
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                <p className="text-sm leading-7 text-slate-600">
                  {tourData?.description || "No description available."}
                </p>
              </div>
            </section>

            {/* =================================================
                TOUR INFORMATION
            ================================================= */}

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                Tour Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {tourData?.company ? (
                      <Building2 className="w-5 h-5 text-slate-600" />
                    ) : (
                      <Globe2 className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      Tour Owner
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {tourData?.company?.companyName || "Platform Tour"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      Created By
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {tourData?.createdBy?.name || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CalendarDays className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      Created
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(tourData?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CalendarDays className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      Last Updated
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(tourData?.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                SAFETY OVERVIEW
            ================================================= */}

            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                    Weather & Safety
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 ml-4">
                    Real-time regional conditions for your itinerary
                  </p>
                </div>
                {dailySafety.length > 0 && (
                  <div className="hidden sm:flex items-center gap-3">
                    {safetySummary.safe > 0 && (
                      <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-1.5">
                        <CircleCheck className="w-4 h-4" />
                        {safetySummary.safe} Safe
                      </span>
                    )}
                    {safetySummary.warning > 0 && (
                      <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        {safetySummary.warning} Warning
                      </span>
                    )}
                    {safetySummary.danger > 0 && (
                      <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        {safetySummary.danger} Danger
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Loading */}
              {isPending && (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
                  <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-700">
                    Checking safety conditions...
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Fetching latest weather & regional alerts
                  </p>
                </div>
              )}

              {/* Error */}
              {isError && !isPending && (
                <div className="rounded-3xl border-2 border-red-200 bg-red-50/80 p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800 text-lg">
                        Unable to load safety information
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {error?.response?.data?.message ||
                          error?.message ||
                          "Something went wrong while checking tour safety."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety Days */}
              {!isPending && !isError && dailySafety.length > 0 && tourData?.itinerary && (
                <div className="space-y-5">
                  {tourData.itinerary.map((day) => {
                    const safety = dailySafety.find((item) => item.day === day.day);
                    return (
                      <ItineraryDay key={day._id || day.day} day={day} safety={safety} />
                    );
                  })}
                </div>
              )}

              {/* No safety */}
              {!isPending && !isError && dailySafety.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
                  <CloudSun className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-slate-700">
                    Safety information not available
                  </p>
                  <p className="text-sm text-slate-400">Check back later for updates</p>
                </div>
              )}
            </section>

            {/* =================================================
                BUDGET
            ================================================= */}

            {tourData?.budgetBreakdown && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  Budget Breakdown
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                    <Hotel className="w-6 h-6 text-blue-500 mb-3" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      Hotel
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      PKR {formatCurrency(tourData.budgetBreakdown.hotel)}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
                    <Car className="w-6 h-6 text-indigo-500 mb-3" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      Transport
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      PKR {formatCurrency(tourData.budgetBreakdown.transport)}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200">
                    <Utensils className="w-6 h-6 text-orange-500 mb-3" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      Food
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      PKR {formatCurrency(tourData.budgetBreakdown.food)}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
                    <Sparkles className="w-6 h-6 text-amber-500 mb-3" />
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      Activities
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      PKR {formatCurrency(tourData.budgetBreakdown.activities)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                TRAVEL TIPS
            ================================================= */}

            {tourData?.travelTips?.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  Travel Tips
                </h3>
                <div className="space-y-3">
                  {tourData.travelTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200"
                    >
                      <CircleCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* =================================================
                BEST TIME
            ================================================= */}

            {tourData?.bestTimeToVisit && (
              <section>
                <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100/50 border-2 border-sky-200 p-6">
                  <div className="flex items-start gap-4">
                    <CalendarDays className="w-7 h-7 text-sky-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sky-900 text-lg">
                        Best Time to Visit
                      </h4>
                      <p className="text-sm text-sky-800 mt-1">{tourData.bestTimeToVisit}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* =================================================
                IMPORTANT NOTES
            ================================================= */}

            {tourData?.importantNotes?.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  Important Notes
                </h3>
                <div className="space-y-3">
                  {tourData.importantNotes.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-red-50/80 border border-red-200"
                    >
                      <Info className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700">{note}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* =================================================
                FAQ
            ================================================= */}

            {tourData?.faqs?.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {tourData.faqs.map((faq, index) => (
                    <details
                      key={faq._id || index}
                      className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
                    >
                      <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                        <span className="text-sm font-bold text-slate-800 flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {faq.question}
                        </span>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="px-8 py-5 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-8 h-12 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
// Home.jsx (Updated with Booking Functionality)
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Compass,
  Building2,
  Globe2,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerFcmToken } from "../../services/notification.service";

import Hero from "../../components/user/Hero";
import TourCard from "../shared/tours/TourCard";
import { useInfinitePublicTours } from "../../api/queries/useTraveler";
import {
  useCreateBooking,
  usePaymentRedirection,
} from "../../api/queries/useBooking";

/* =========================================================
   CONSTANTS
========================================================= */

const TOURS_PER_PAGE = 8;

/* =========================================================
   HELPERS
========================================================= */

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.src || image.image?.url || "";
};

/* =========================================================
   BOOKING MODAL COMPONENT (Inline for simplicity)
========================================================= */
const BookingModal = ({
  tour,
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  error: externalError,
}) => {
  const [participants, setParticipants] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [provider, setProvider] = useState("stripe");
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalError) {
      console.log("External error received:", externalError);

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

    if (
      tour.maxParticipants &&
      Number(participants) > Number(tour.maxParticipants)
    ) {
      setError(
        `This tour allows a maximum of ${tour.maxParticipants} travelers.`,
      );
      return;
    }

    onConfirm({
      tourId: tour._id,
      participants: Number(participants),
      travelDate,
      provider,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Book Tour</h2>
            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
              {tour.title}
            </p>
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
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  Booking unavailable
                </p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Price per person</span>
              <span className="text-lg font-bold text-slate-900">
                {new Intl.NumberFormat("en-PK", {
                  style: "currency",
                  currency: "PKR",
                  maximumFractionDigits: 0,
                }).format(tour.price)}
              </span>
            </div>
          </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
              required
            />
            {tour.maxParticipants && (
              <p className="text-xs text-slate-400 mt-1">
                Max {tour.maxParticipants} travelers allowed
              </p>
            )}
          </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <CreditCard size={16} className="inline mr-2" />
              Payment Method
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
            >
              <option value="stripe">Stripe (Credit/Debit Card)</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-amber-600">
                {new Intl.NumberFormat("en-PK", {
                  style: "currency",
                  currency: "PKR",
                  maximumFractionDigits: 0,
                }).format(totalAmount)}
              </span>
            </div>
          </div>

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
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition disabled:opacity-50 flex items-center justify-center"
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
   HOME COMPONENT
========================================================= */

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    registerFcmToken();
  }, []);

  /* =======================================================
     BOOKING STATE
  ======================================================= */
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =======================================================
     BOOKING HOOKS
  ======================================================= */
  const createBookingMutation = useCreateBooking();
  const { redirectToPayment, isProcessing: isPaymentProcessing } =
    usePaymentRedirection();

  /* =======================================================
     SEARCH
  ======================================================= */
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  /* =======================================================
     FILTERS
  ======================================================= */
  const [provider, setProvider] = useState("all");
  const [companyId, setCompanyId] = useState("");
  const [sort, setSort] = useState("newest");

  /* =======================================================
     DEBOUNCED SEARCH
  ======================================================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* =======================================================
     TOUR QUERY PARAMETERS
  ======================================================= */
  const tourParams = useMemo(
    () => ({
      limit: TOURS_PER_PAGE,
      search,
      provider,
      companyId,
      sort,
      order: "desc",
    }),
    [search, provider, companyId, sort],
  );

  /* =======================================================
     INFINITE TOURS QUERY
  ======================================================= */
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfinitePublicTours(tourParams);

  /* =======================================================
     ALL LOADED PAGES
  ======================================================= */
  const pages = data?.pages || [];

  /* =======================================================
     FLATTEN TOURS FROM ALL PAGES
  ======================================================= */
  const tours = useMemo(() => {
    const allTours = pages.flatMap((page) => {
      const pageData = page?.data || page?.tours || [];
      return Array.isArray(pageData) ? pageData : [];
    });

    const uniqueTours = new Map();
    allTours.forEach((tour) => {
      if (tour?._id) {
        uniqueTours.set(tour._id, tour);
      }
    });

    return Array.from(uniqueTours.values());
  }, [pages]);

  /* =======================================================
     TOTAL TOURS
  ======================================================= */
  const totalTours = Number(pages?.[0]?.meta?.totalDocuments || 0);

  /* =======================================================
     COMPANIES
  ======================================================= */
  const companies = useMemo(() => {
    const uniqueCompanies = new Map();

    tours.forEach((tour) => {
      const company = tour?.company;
      if (company?._id && company?.companyName) {
        uniqueCompanies.set(company._id, {
          _id: company._id,
          companyName: company.companyName,
        });
      }
    });

    return Array.from(uniqueCompanies.values()).sort((a, b) =>
      a.companyName.localeCompare(b.companyName),
    );
  }, [tours]);

  /* =======================================================
     DESTINATIONS WITH TOUR DATA
  ======================================================= */
  const destinations = useMemo(() => {
    const unique = new Map();

    tours.forEach((tour) => {
      const destinationName =
        typeof tour?.to === "string" ? tour.to.trim() : "";
      if (!destinationName) return;

      const key = destinationName.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, {
          name: destinationName,
          image: getImageUrl(tour?.coverImage),
          tour: tour,
        });
      }
    });

    return Array.from(unique.values()).slice(0, 6);
  }, [tours]);

  /* =======================================================
     ACTIVE FILTERS
  ======================================================= */
  const hasActiveFilters =
    searchInput.trim() || provider !== "all" || companyId || sort !== "newest";

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setProvider("all");
    setCompanyId("");
    setSort("newest");
  };

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  /* =======================================================
     PROVIDER CHANGE
  ======================================================= */
  const handleProviderChange = (e) => {
    setProvider(e.target.value);
    setCompanyId("");
  };

  /* =======================================================
     COMPANY CHANGE
  ======================================================= */
  const handleCompanyChange = (e) => {
    setCompanyId(e.target.value);
  };

  /* =======================================================
     SORT CHANGE
  ======================================================= */
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  /* =======================================================
     VIEW MORE
  ======================================================= */
  const handleViewMore = () => {
    if (isFetchingNextPage || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  /* =======================================================
     VIEW TOUR DETAILS
  ======================================================= */
  const handleViewDetails = (tour) => {
    navigate(`/tours/${tour._id}`);
  };

  /* =======================================================
     BOOK TOUR - OPEN MODAL
  ======================================================= */
  const handleBook = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  /* =======================================================
     CONFIRM BOOKING - CREATE BOOKING & REDIRECT TO PAYMENT
  ======================================================= */
  const handleConfirmBooking = async (bookingData) => {
    try {
      console.log(bookingData);

      const cleanBookingData = {
        tourId: bookingData.tourId,
        participants: Number(bookingData.participants),
        travelDate: bookingData.travelDate,
        provider: bookingData.provider || "stripe",
      };

      const response =
        await createBookingMutation.mutateAsync(cleanBookingData);

      toast.success("Booking created! Redirecting to payment...");

      const result = await redirectToPayment(response);

      if (result?.success && result?.method === "manual") {
        toast.success("Booking confirmed successfully!");
        navigate(`/dashboard/bookings`);
      }

      setIsModalOpen(false);
      setSelectedTour(null);
    } catch (error) {
      console.error("Full error object:", error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Booking failed";

      toast.error(errorMessage);
    }
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */
  const handleCloseModal = () => {
    if (!createBookingMutation.isPending && !isPaymentProcessing) {
      setIsModalOpen(false);
      setSelectedTour(null);
    }
  };

  /* =======================================================
     DESTINATION CLICK - Navigate to tour detail
  ======================================================= */
  const handleDestinationClick = (destination) => {
    if (!destination?.tour?._id) {
      if (destination?.name) {
        setSearchInput(destination.name);
        setSearch(destination.name);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return;
    }

    navigate(`/tours/${destination.tour._id}`);
  };

  /* =======================================================
     IS PROCESSING
  ======================================================= */
  const isProcessing = createBookingMutation.isPending || isPaymentProcessing;

  /* =======================================================
     PAGE
  ======================================================= */
  return (
    <main className="min-h-screen bg-bg-secondary">
      {/* =====================================================
          HERO
      ===================================================== */}
      <Hero />

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
        <div className="mx-auto">
          {/* SECTION HEADING */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Compass size={18} className="text-brand-primary" />
              <span className="text-sm font-semibold text-brand-primary">
                Explore experiences
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Find your perfect tour
                </h2>
                <p className="section-description mt-1">
                  Search and filter tours from TourismOS and trusted travel
                  companies.
                </p>
              </div>

              {totalTours > 0 && (
                <div className="text-sm text-text-muted shrink-0">
                  {totalTours} {totalTours === 1 ? "tour" : "tours"} available
                </div>
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search tours, places or experiences..."
              className="input-primary pl-11 h-12"
            />
          </div>

          {/* FILTER HEADER - only the Clear filters button, no toggle */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-error transition cursor-pointer"
              >
                <X size={14} />
                Clear filters
              </button>
            </div>
          )}

          {/* FILTERS - always visible */}
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* PROVIDER */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Tour Provider
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <select
                    value={provider}
                    onChange={handleProviderChange}
                    style={{ color: "#f59e0b" }}
                    className="input-primary pl-10 pr-10 appearance-none cursor-pointer font-semibold"
                  >
                    <option value="all" style={{ color: "#f59e0b" }}>
                      All Tours
                    </option>
                    <option value="platform" style={{ color: "#f59e0b" }}>
                      TourismOS Tours
                    </option>
                    <option value="company" style={{ color: "#f59e0b" }}>
                      Company Tours
                    </option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* COMPANY */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Travel Company
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <select
                    value={companyId}
                    onChange={handleCompanyChange}
                    disabled={companies.length === 0}
                    style={{ color: "#f59e0b" }}
                    className="input-primary pl-10 pr-10 appearance-none cursor-pointer disabled:bg-bg-tertiary font-semibold"
                  >
                    <option value="" style={{ color: "#f59e0b" }}>
                      All Companies
                    </option>
                    {companies.map((company) => (
                      <option
                        key={company._id}
                        value={company._id}
                        style={{ color: "#f59e0b" }}
                      >
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* SORT */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Sort Tours
                </label>
                <div className="relative">
                  <ArrowUpDown
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    style={{ color: "#f59e0b" }}
                    className="input-primary pl-10 pr-10 appearance-none cursor-pointer font-semibold"
                  >
                    <option value="newest" style={{ color: "#f59e0b" }}>
                      Newest
                    </option>
                    <option value="popular" style={{ color: "#f59e0b" }}>
                      Most Popular
                    </option>
                    <option value="price-low" style={{ color: "#f59e0b" }}>
                      Price: Low to High
                    </option>
                    <option value="price-high" style={{ color: "#f59e0b" }}>
                      Price: High to Low
                    </option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED TOURS
      ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass size={18} className="text-brand-primary" />
              <span className="text-sm font-semibold text-brand-primary">
                Explore experiences
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Featured tours
            </h2>
            <p className="section-description max-w-xl">
              Handpicked experiences from our platform and trusted travel
              companies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            {isFetching && !isFetchingNextPage && (
              <Loader2 size={15} className="animate-spin" />
            )}
          </div>
        </div>

        {/* ERROR */}
        {isError && (
          <div className="card p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-error-soft flex items-center justify-center">
              <AlertCircle size={22} className="text-error" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Unable to load tours</h3>
            <p className="mt-1 text-sm text-text-muted">
              Something went wrong while loading tours.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn-outline-sm mt-4 gap-2"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {/* INITIAL LOADING */}
        {!isError && isLoading && tours.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-soft flex items-center justify-center">
              <Loader2 size={24} className="text-brand-primary animate-spin" />
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              Discovering tours for you...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!isError && !isLoading && tours.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-soft flex items-center justify-center">
              <Compass size={25} className="text-brand-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No tours found</h3>
            <p className="mt-1 text-sm text-text-muted">
              Try adjusting your search or filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary-sm mt-5"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* TOUR CARDS */}
        {!isError && tours.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onViewDetails={handleViewDetails}
                  onBook={handleBook}
                />
              ))}
            </div>

            {/* VIEW MORE - Only show if there are more tours */}
            {hasNextPage && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={handleViewMore}
                  disabled={isFetchingNextPage}
                  className="btn-outline gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Loading more tours...
                    </>
                  ) : (
                    <>
                      View More Tours
                      <ChevronDown size={17} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* =====================================================
          POPULAR DESTINATIONS
      ===================================================== */}
      {destinations.length > 0 && (
        <section className="border-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe2 size={18} className="text-brand-primary" />
                <span className="text-sm font-semibold text-brand-primary">
                  Popular destinations
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold">
                Where will you go next?
              </h2>
              <p className="section-description">
                Explore destinations travelers are discovering through
                TourismOS.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {destinations.map((destination) => (
                <button
                  key={destination.name}
                  type="button"
                  onClick={() => handleDestinationClick(destination)}
                  className="group relative h-48 rounded-2xl overflow-hidden bg-bg-tertiary cursor-pointer text-left"
                >
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin size={28} className="text-text-muted" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute left-4 right-4 bottom-4">
                    <p className="text-white font-semibold text-sm">
                      {destination.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-white/80 text-xs">
                      <MapPin size={12} />
                      {destination.tour ? "View Tour" : "Explore tours"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PROVIDER CTA
      ===================================================== */}

      {/* =====================================================
          BOOKING MODAL
      ===================================================== */}
      <BookingModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
        isProcessing={isProcessing}
        error={createBookingMutation.error}
      />
    </main>
  );
};

export default Home;

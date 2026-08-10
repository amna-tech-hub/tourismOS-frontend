import React from "react";
import {
  useAdminDashboardRevenue,
  useBookingOverview,
  useCompanyOverview,
  usePlatformStats,
} from "../../api/queries/useSuperAdmin";
import { FaBuilding } from "react-icons/fa";
import { FaPerson, FaRupeeSign } from "react-icons/fa6";
import { CiBookmarkCheck } from "react-icons/ci";
import RevenueChart from "../../components/charts/super-admin-chart/RevenueChart";
import BookingOverviewChart from "../../components/charts/super-admin-chart/BookingOverviewChart";
import CompanyOverviewChart from "../../components/charts/super-admin-chart/CompanyOverviewChart";

export default function SuperAdminDashboard() {
  // =========================================================
  // DASHBOARD QUERIES
  // =========================================================

  const {
    data: revenueData,
    isLoading: isRevenueLoading,
    isError: isRevenueError,
  } = useAdminDashboardRevenue();

  const {
    data: bookingData,
    isLoading: isBookingLoading,
    isError: isBookingError,
  } = useBookingOverview();

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useCompanyOverview();

  const {
    data: platformData,
    isLoading: isPlatformLoading,
    isError: isPlatformError,
  } = usePlatformStats();

  // =========================================================
  // DATA
  // =========================================================

  const revenue = revenueData?.data || [];
  const bookingOverview = bookingData?.data || [];
  const companyOverview = companyData?.data || [];

  const platformStats = platformData?.data || {};

  const totalCompanies = platformStats.totalCompanies || 0;
  const totalUsers = platformStats.totalUsers || 0;
  const totalBookings = platformStats.totalBookings || 0;
  const totalRevenue = platformStats.totalRevenue || 0;

  // =========================================================
  // REVENUE CALCULATIONS
  // =========================================================

  const totalPeriodRevenue = revenue.reduce(
    (total, item) => total + (item.revenue || 0),
    0
  );

  const latestRevenue =
    revenue.length > 0 ? revenue[revenue.length - 1] : null;

  // =========================================================
  // DATE
  // =========================================================

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // =========================================================
  // REVENUE RANGE
  // =========================================================

  const revenueStart = revenue[0];
  const revenueEnd = revenue[revenue.length - 1];

  const revenueRange =
    revenueStart && revenueEnd
      ? `${revenueStart.month} ${revenueStart.year} — ${revenueEnd.month} ${revenueEnd.year}`
      : "Last 12 months";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 mb-2">
            Super Admin
          </p>

          <h1 className="text-4xl font-bold font-serif text-slate-900">
            Platform Overview
          </h1>

          <p className="subheading text-sm mt-2 max-w-2xl">
            Monitor TourismOS performance, platform activity, and financial
            health from one place.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          {formattedDate}
        </div>
      </section>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Companies */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Companies
            </span>

            <div className="w-10 h-10 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-700">
              <FaBuilding className="text-sm" />
            </div>
          </div>

          <div className="mt-4">
            {isPlatformLoading ? (
              <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
            ) : isPlatformError ? (
              <p className="text-sm text-red-500">Unable to load</p>
            ) : (
              <p className="text-3xl font-bold text-slate-900">
                {totalCompanies.toLocaleString()}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              Registered platform companies
            </p>
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Travelers
            </span>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FaPerson className="text-base" />
            </div>
          </div>

          <div className="mt-4">
            {isPlatformLoading ? (
              <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
            ) : isPlatformError ? (
              <p className="text-sm text-red-500">Unable to load</p>
            ) : (
              <p className="text-3xl font-bold text-slate-900">
                {totalUsers.toLocaleString()}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              Registered traveler accounts
            </p>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Bookings
            </span>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CiBookmarkCheck className="text-xl" />
            </div>
          </div>

          <div className="mt-4">
            {isPlatformLoading ? (
              <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
            ) : isPlatformError ? (
              <p className="text-sm text-red-500">Unable to load</p>
            ) : (
              <p className="text-3xl font-bold text-slate-900">
                {totalBookings.toLocaleString()}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              Total platform bookings
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>

            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
              <FaRupeeSign className="text-sm" />
            </div>
          </div>

          <div className="mt-4">
            {isPlatformLoading ? (
              <div className="h-9 w-28 bg-slate-100 rounded-lg animate-pulse" />
            ) : isPlatformError ? (
              <p className="text-sm text-red-500">Unable to load</p>
            ) : (
              <p className="text-3xl font-bold text-slate-900">
                PKR {totalRevenue.toLocaleString()}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              All successful platform payments
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          REVENUE OVERVIEW (RESTORED TO 340PX HEIGHT)
      ===================================================== */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">
                Revenue Overview
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Platform revenue generated from successful payments.
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Period
              </p>

              <p className="text-xs font-semibold text-slate-700 mt-1">
                {revenueRange}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Summary Banner */}
        <div className="px-6">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Period Revenue
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {isRevenueLoading
                  ? "Loading..."
                  : `PKR ${totalPeriodRevenue.toLocaleString()}`}
              </p>
            </div>

            {latestRevenue && (
              <div className="sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Latest Month
                </p>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {latestRevenue.month} {latestRevenue.year}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  PKR {(latestRevenue.revenue || 0).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="px-6 pb-6 pt-5">
          {isRevenueLoading ? (
            <div className="h-[340px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />

              <p className="text-xs text-slate-400 mt-4">
                Loading revenue analytics...
              </p>
            </div>
          ) : isRevenueError ? (
            <div className="h-[340px] flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                !
              </div>

              <p className="text-sm font-semibold text-slate-700">
                Unable to load revenue data
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Please refresh the dashboard and try again.
              </p>
            </div>
          ) : revenue.length === 0 ? (
            <div className="h-[340px] flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-slate-700">
                No revenue data available
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Revenue will appear after successful payments are recorded.
              </p>
            </div>
          ) : (
            <div className="h-[340px] w-full min-h-[340px]">
              <RevenueChart data={revenue} />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          BOOKING + COMPANY OVERVIEW
      ===================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-5">
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Booking Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current distribution of platform bookings by status.
            </p>
          </div>

          <div className="px-6 pb-6">
            {isBookingLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : isBookingError ? (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Unable to load booking data
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Please refresh the dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <BookingOverviewChart data={bookingOverview} />
            )}
          </div>
        </div>

        {/* Company Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-5">
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Company Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current status of companies registered on TourismOS.
            </p>
          </div>

          <div className="px-6 pb-6">
            {isCompanyLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : isCompanyError ? (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Unable to load company data
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Please refresh the dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <CompanyOverviewChart data={companyOverview} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
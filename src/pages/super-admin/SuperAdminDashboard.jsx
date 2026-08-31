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
  // DATA EXTRACTION
  // =========================================================

  const revenue = revenueData?.data?.trend || [];
  const revenueSummary = revenueData?.data?.summary || {};
  const bookingOverview = bookingData?.data || [];
  const companyOverview = companyData?.data || [];

  const platformStats = platformData?.data || {};
  const platformRevenue = platformStats.platformRevenue || {};
  const activity = platformStats.activity || {};
  const health = platformStats.health || {};

  const totalPlatformRevenue = platformRevenue.total || 0;
  const fromBookings = platformRevenue.fromBookings || 0;
  const fromSubscriptions = platformRevenue.fromSubscriptions || 0;
  const effectiveCommissionRate = platformRevenue.effectiveCommissionRate || 0;

  const totalCompanies = activity.totalCompanies || 0;
  const totalUsers = activity.totalUsers || 0;
  const totalBookings = activity.totalBookings || 0;
  const totalBookingValue = activity.totalBookingValue || 0;
  const totalPayouts = activity.totalPayoutsToCompanies || 0;

  // =========================================================
  // REVENUE CALCULATIONS
  // =========================================================

  const totalPeriodRevenue = revenue.reduce(
    (total, item) => total + (item.platformRevenue || 0),
    0
  );

  const latestRevenue = revenue.length > 0 ? revenue[revenue.length - 1] : null;

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
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10 min-w-0 w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-yellow-600 mb-1 sm:mb-2">
            Super Admin
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Platform Overview
          </h1>

          <p className="text-xs sm:text-sm mt-1 sm:mt-2 max-w-2xl text-slate-500">
            Monitor TourismOS performance, platform activity, and financial
            health from one place.
          </p>
        </div>
      </section>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}
   
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
  {/* Platform Revenue Card */}
  <div className="card-yellow p-4 sm:p-5 flex flex-col">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-yellow-700/80">
        Platform Revenue
      </span>
      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-200/60 flex items-center justify-center text-yellow-600 shrink-0">
        <FaRupeeSign className="text-sm" />
      </div>
    </div>
    <div className="mt-3">
      {isPlatformLoading ? (
        <div className="h-9 w-28 bg-yellow-200/30 rounded-lg animate-pulse" />
      ) : isPlatformError ? (
        <p className="text-sm text-rose-500">Unable to load</p>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
            PKR {totalPlatformRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="badge-success text-[9px] px-2 py-0.5">
              {effectiveCommissionRate}% avg commission
            </span>
            <span className="badge-gray text-[9px] px-2 py-0.5">
              +{fromSubscriptions.toLocaleString()} subs
            </span>
          </div>
        </>
      )}
    </div>
    <div className="mt-auto pt-3 border-t border-yellow-200/40">
      <p className="text-[10px] text-slate-500">
        {fromBookings.toLocaleString()} bookings · subscriptions
      </p>
    </div>
  </div>

  {/* Companies Card */}
  <div className="card p-4 sm:p-5 flex flex-col">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Companies
      </span>
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
        <FaBuilding className="text-sm" />
      </div>
    </div>
    <div className="mt-3">
      {isPlatformLoading ? (
        <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
      ) : isPlatformError ? (
        <p className="text-sm text-rose-500">Unable to load</p>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-slate-900">
          {totalCompanies.toLocaleString()}
        </p>
      )}
    </div>
    <div className="mt-auto pt-3 border-t border-slate-100">
      <p className="text-[10px] text-slate-400">
        Registered platform companies
      </p>
    </div>
  </div>

  {/* Travelers Card */}
  <div className="card p-4 sm:p-5 flex flex-col">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Travelers
      </span>
      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
        <FaPerson className="text-sm" />
      </div>
    </div>
    <div className="mt-3">
      {isPlatformLoading ? (
        <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
      ) : isPlatformError ? (
        <p className="text-sm text-rose-500">Unable to load</p>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-slate-900">
          {totalUsers.toLocaleString()}
        </p>
      )}
    </div>
    <div className="mt-auto pt-3 border-t border-slate-100">
      <p className="text-[10px] text-slate-400">
        Registered traveler accounts
      </p>
    </div>
  </div>

  {/* Bookings Card */}
  <div className="card p-4 sm:p-5 flex flex-col">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Bookings
      </span>
      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
        <CiBookmarkCheck className="text-lg" />
      </div>
    </div>
    <div className="mt-3">
      {isPlatformLoading ? (
        <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse" />
      ) : isPlatformError ? (
        <p className="text-sm text-rose-500">Unable to load</p>
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            {totalBookings.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            PKR {totalBookingValue.toLocaleString()} total value
          </p>
        </>
      )}
    </div>
    <div className="mt-auto pt-3 border-t border-slate-100">
      <p className="text-[10px] text-slate-400">
        Platform bookings
      </p>
    </div>
  </div>
</section>

      {/* =====================================================
          REVENUE OVERVIEW
      ===================================================== */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Revenue Overview
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Platform revenue from commissions and subscriptions.
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Period
              </p>

              <p className="text-xs font-semibold text-slate-700 mt-0.5 sm:mt-1">
                {revenueRange}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Summary Banner with Breakdown */}
        <div className="px-4 sm:px-6">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Period Revenue
              </p>

              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">
                {isRevenueLoading
                  ? "Loading..."
                  : `PKR ${totalPeriodRevenue.toLocaleString()}`}
              </p>
              
              {!isRevenueLoading && !isRevenueError && (
                <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Commissions: PKR {revenueSummary.totalCommission?.toLocaleString() || 0}
                  </span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Subscriptions: PKR {revenueSummary.totalSubscriptionRevenue?.toLocaleString() || 0}
                  </span>
                </div>
              )}
            </div>

            {latestRevenue && (
              <div className="sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Latest Month
                </p>

                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                  {latestRevenue.month} {latestRevenue.year}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  PKR {(latestRevenue.platformRevenue || 0).toLocaleString()}
                </p>
                
                <p className="text-[9px] text-slate-400 mt-0.5">
                  {latestRevenue.commissionRevenue > 0 && `${latestRevenue.commissionRevenue.toLocaleString()} commission`}
                  {latestRevenue.commissionRevenue > 0 && latestRevenue.subscriptionRevenue > 0 && ' + '}
                  {latestRevenue.subscriptionRevenue > 0 && `${latestRevenue.subscriptionRevenue.toLocaleString()} subscriptions`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-5">
          {isRevenueLoading ? (
            <div className="h-[260px] sm:h-[340px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
              <p className="text-xs text-slate-400 mt-4">
                Loading revenue analytics...
              </p>
            </div>
          ) : isRevenueError ? (
            <div className="h-[260px] sm:h-[340px] flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
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
            <div className="h-[260px] sm:h-[340px] flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-semibold text-slate-700">
                No revenue data available
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Revenue will appear after successful payments are recorded.
              </p>
            </div>
          ) : (
            <div className="h-[260px] sm:h-[340px] w-full min-h-[260px]">
              <RevenueChart data={revenue} />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          BOOKING + COMPANY OVERVIEW
      ===================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Booking Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Booking Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current distribution of platform bookings by status.
            </p>
          </div>

          <div className="px-4 sm:px-6 pb-5 sm:pb-6">
            {isBookingLoading ? (
              <div className="h-[260px] sm:h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
              </div>
            ) : isBookingError ? (
              <div className="h-[260px] sm:h-[300px] flex items-center justify-center text-center p-4">
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
              <div className="h-[260px] sm:h-[300px] w-full">
                <BookingOverviewChart data={bookingOverview} />
              </div>
            )}
          </div>
        </div>

        {/* Company Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Company Overview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current status of companies registered on TourismOS.
            </p>
          </div>

          <div className="px-4 sm:px-6 pb-5 sm:pb-6">
            {isCompanyLoading ? (
              <div className="h-[260px] sm:h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
              </div>
            ) : isCompanyError ? (
              <div className="h-[260px] sm:h-[300px] flex items-center justify-center text-center p-4">
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
              <div className="h-[260px] sm:h-[300px] w-full">
                <CompanyOverviewChart data={companyOverview} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import {
  Users,
  Map,
  CalendarCheck,
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  RefreshCw,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useCompanyDashboard } from "../../api/queries/useCompany";
import { useNavigate } from "react-router-dom";
import { FaBots } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (number = 0) => {
  return new Intl.NumberFormat("en-US").format(number);
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};


// ======================================================
// STATUS BADGE
// ======================================================

const BookingStatus = ({ status }) => {
  const styles = {
    confirmed:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending:
      "bg-yellow-50 text-yellow-700 border-yellow-100",
    cancelled:
      "bg-rose-50 text-rose-700 border-rose-100",
  };

  const icons = {
    confirmed: CheckCircle2,
    pending: Clock3,
    cancelled: XCircle,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        styles[status] ||
        "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      <Icon size={12} />
      {status || "unknown"}
    </span>
  );
};


// ======================================================
// PAYMENT STATUS
// ======================================================

const PaymentStatus = ({ status }) => {
  const isPaid = status === "paid";

  return (
    <span
      className={`text-xs font-medium ${
        isPaid
          ? "text-emerald-600"
          : status === "refunded"
          ? "text-rose-600"
          : "text-slate-400"
      }`}
    >
      {isPaid
        ? "Paid"
        : status === "refunded"
        ? "Refunded"
        : "Payment pending"}
    </span>
  );
};


// ======================================================
// KPI CARD
// ======================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
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
// CUSTOM CHART TOOLTIP
// ======================================================

const BookingTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="mb-1 text-xs font-medium text-slate-400">
        {formatShortDate(label)}
      </p>

      <p className="text-sm font-semibold text-slate-900">
        {payload[0].value}{" "}
        {payload[0].value === 1
          ? "booking"
          : "bookings"}
      </p>
    </div>
  );
};


// ======================================================
// MAIN COMPONENT
// ======================================================

const Overview = () => {
  const [period, setPeriod] = useState(30);
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCompanyDashboard(period);

  // ----------------------------------------------------
  // API RESPONSE
  // ----------------------------------------------------

  const dashboard = response?.data;

  const company = dashboard?.company;

  const stats = dashboard?.stats || {};

  const bookingTrend =
    dashboard?.bookingTrend?.data || [];

  const recentBookings =
    dashboard?.recentBookings || [];

  const recentTours =
    dashboard?.recentTours || [];

  const aiCredits =
    dashboard?.aiCredits || {};

  // ----------------------------------------------------
  // CHART DATA
  // ----------------------------------------------------

  const chartData = useMemo(() => {
    return bookingTrend.map((item) => ({
      ...item,
      formattedDate: item.date,
    }));
  }, [bookingTrend]);

  // ----------------------------------------------------
  // LOADING
  // ----------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-yellow-500"
          />

          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ERROR
  // ----------------------------------------------------

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertCircle size={24} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading your
            company overview.
          </p>

          <button
            onClick={() => refetch()}
            className="btn-primary mt-5"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AI CREDIT PROGRESS
  // ----------------------------------------------------

  const creditPercentage =
    Math.min(
      100,
      Math.max(
        0,
        aiCredits.percentageRemaining || 0
      )
    );

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="space-y-6 pb-10">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-yellow-600">
              Company Overview
            </p>

            {company?.status && (
              <span className="badge-yellow capitalize">
                {company.status}
              </span>
            )}
          </div>

          <h1 className="mt-1 text-3xl font-semibold text-slate-900 ">
            Welcome back,{" "}
            <span className="text-yellow-500 font-semibold font-serif" >
              {company?.name || "Company"}
            </span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your travel
            business.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn-outline self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>

      </div>


      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            stats.totalRevenue
          )}
          subtitle="After platform commission"
          icon={Wallet}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <StatCard
          title="Total Bookings"
          value={formatNumber(
            stats.totalBookings
          )}
          subtitle="All company bookings"
          icon={CalendarCheck}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Total Tours"
          value={formatNumber(
            stats.totalTours
          )}
          subtitle="Active company tours"
          icon={Map}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Employees"
          value={formatNumber(
            stats.totalEmployees
          )}
          subtitle="Team members"
          icon={Users}
          iconClass="bg-purple-50 text-purple-600"
        />

      </div>


      {/* ==================================================
          REVENUE SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Gross Revenue
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Wallet size={17} />
            </div>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formatCurrency(
              stats.grossRevenue
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total amount paid by customers
          </p>
        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Platform Commission
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
              <ArrowUpRight size={17} />
            </div>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formatCurrency(
              stats.totalCommission
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Deducted by TourismOS
          </p>
        </div>


        <div className="rounded-2xl border border-yellow-200 bg-yellow-50/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-yellow-700">
              Your Earnings
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
              <TrendingUp size={17} />
            </div>
          </div>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {formatCurrency(
              stats.totalRevenue
            )}
          </p>

          <p className="mt-1 text-xs text-yellow-700/70">
            Gross revenue minus commission
          </p>
        </div>

      </div>


      {/* ==================================================
          BOOKING TREND + AI CREDITS
      ================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ================================================
            BOOKING TREND
        ================================================ */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Booking Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Booking activity over time
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-1">

              {[7, 30, 90].map((value) => (
                <button
                  key={value}
                  onClick={() => setPeriod(value)}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium ${
                    period === value
                      ? "bg-white text-slate-900"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {value}D
                </button>
              ))}

            </div>

          </div>


          <div className="mt-6 h-[300px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="bookingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#F59E0B"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#F59E0B"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatShortDate}
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={25}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<BookingTooltip />}
                />

                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#bookingGradient)"
                  activeDot={{
                    r: 5,
                  }}
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* ================================================
            AI CREDITS
        ================================================ */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-start justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                  <FaRobot size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    AI Credits
                  </h2>

                  <p className="text-xs text-slate-400">
                    {aiCredits.plan || "Starter"} Plan
                  </p>
                </div>
              </div>
            </div>

            <span className="badge-yellow">
              {aiCredits.plan || "Starter"}
            </span>

          </div>


          <div className="mt-7">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  {formatNumber(
                    aiCredits.remaining
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  credits remaining
                </p>
              </div>

              <p className="text-sm font-semibold text-yellow-600">
                {aiCredits.percentageRemaining || 0}%
              </p>

            </div>


            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width: `${creditPercentage}%`,
                }}
              />

            </div>


            <div className="mt-3 flex justify-between text-xs text-slate-400">

              <span>
                Used{" "}
                {formatNumber(
                  aiCredits.used
                )}
              </span>

              <span>
                Total{" "}
                {formatNumber(
                  aiCredits.total
                )}
              </span>

            </div>

          </div>


          <div className="mt-7 border-t border-slate-100 pt-5">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={14} />

              <span>
                Last used{" "}
                {aiCredits.lastUsedAt
                  ? formatDate(
                      aiCredits.lastUsedAt
                    )
                  : "Never"}
              </span>
            </div>


            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays size={14} />

              <span>
                Expires{" "}
                {aiCredits.expiresAt
                  ? formatDate(
                      aiCredits.expiresAt
                    )
                  : "—"}
              </span>
            </div>

          </div>


          <button
            className="btn-primary mt-6 w-full cursor-pointer"
            onClick={() => navigate('/company/subscription')}
            type="button"
          >
            <CreditCard
              size={16}
              className="mr-2"
            />
            Manage Subscription
          </button>

        </div>

      </div>


      {/* ==================================================
          RECENT BOOKINGS
      ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest activity from your customers
            </p>
          </div>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700"
            onClick={() => navigate('/company/bookings')}
          >
            View all
            <ArrowRight size={15} />
          </button>

        </div>


        {recentBookings.length === 0 ? (

          <div className="px-5 py-12 text-center">
            <CalendarCheck
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No bookings yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your recent bookings will appear here.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Traveler
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tour
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                </tr>
              </thead>


              <tbody>

                {recentBookings.map((booking) => (

                  <tr
                    key={booking._id}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <td className="px-5 py-4">

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {booking.traveler?.name ||
                            "Unknown traveler"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {booking.traveler?.email ||
                            "—"}
                        </p>
                      </div>

                    </td>


                    <td className="px-5 py-4">

                      <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                        {booking.tour?.title ||
                          "Unknown tour"}
                      </p>

                      {booking.tour?.from &&
                        booking.tour?.to && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {booking.tour.from} →{" "}
                            {booking.tour.to}
                          </p>
                        )}

                    </td>


                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-slate-800">
                        {formatCurrency(
                          booking.totalAmount
                        )}
                      </p>

                      {booking.paymentStatus ===
                        "paid" &&
                        booking.companyPayout !==
                          undefined && (
                          <p className="mt-0.5 text-xs text-emerald-600">
                            Earned{" "}
                            {formatCurrency(
                              booking.companyPayout
                            )}
                          </p>
                        )}

                    </td>


                    <td className="px-5 py-4">
                      <BookingStatus
                        status={booking.status}
                      />
                    </td>


                    <td className="px-5 py-4">
                      <PaymentStatus
                        status={
                          booking.paymentStatus
                        }
                      />
                    </td>


                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(
                        booking.createdAt
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          RECENT TOURS + AI ACTIVITY
      ================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ================================================
            RECENT TOURS
        ================================================ */}

        <div className="rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Tours
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest tour packages
              </p>
            </div>

            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700"
              onClick={() => navigate('/company/tours')}
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="divide-y divide-slate-100">

            {recentTours.length === 0 ? (

              <div className="px-5 py-12 text-center">
                <Map
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No tours yet
                </p>
              </div>

            ) : (

              recentTours.map((tour) => (

                <div
                  key={tour._id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="truncate text-sm font-semibold text-slate-800">
                        {tour.title}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          tour.status ===
                          "published"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tour.status}
                      </span>

                    </div>


                    <p className="mt-1 text-xs text-slate-400">

                      {tour.from &&
                        tour.to
                        ? `${tour.from} → ${tour.to}`
                        : `${tour.duration || 0} day${
                            tour.duration === 1
                              ? ""
                              : "s"
                          }`}

                    </p>


                    <p className="mt-1 text-xs text-slate-400">
                      Created{" "}
                      {formatShortDate(
                        tour.createdAt
                      )}
                    </p>

                  </div>


                  <div className="shrink-0 text-right">

                    <p className="text-sm font-semibold text-slate-800">
                      {formatCurrency(
                        tour.price
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Max{" "}
                      {tour.maxParticipants ||
                        0}{" "}
                      travelers
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        {/* ================================================
            AI ACTIVITY
        ================================================ */}

        <div className="rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                AI Credit Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Recent AI usage and credit changes
              </p>
            </div>

            <Sparkles
              size={19}
              className="text-yellow-500"
            />

          </div>


          <div className="divide-y divide-slate-100">

            {aiCredits.recentActivity?.length ===
            0 ? (

              <div className="px-5 py-12 text-center">
                <Sparkles
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No AI activity yet
                </p>
              </div>

            ) : (

              aiCredits.recentActivity?.map(
                (activity) => {

                  const isUsage =
                    activity.type ===
                    "usage";

                  return (
                    <div
                      key={activity._id}
                      className="flex gap-3 px-5 py-4"
                    >

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isUsage
                            ? "bg-rose-50 text-rose-500"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {isUsage ? (
                          <ArrowUpRight
                            size={16}
                          />
                        ) : (
                          <Sparkles
                            size={16}
                          />
                        )}
                      </div>


                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <p className="text-sm font-medium capitalize text-slate-700">
                            {activity.type}
                          </p>

                          <span
                            className={`shrink-0 text-sm font-semibold ${
                              isUsage
                                ? "text-rose-500"
                                : "text-emerald-600"
                            }`}
                          >
                            {activity.credits > 0
                              ? "+"
                              : ""}
                            {formatNumber(
                              activity.credits
                            )}
                          </span>

                        </div>


                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                          {activity.description ||
                            "AI credit activity"}
                        </p>


                        <p className="mt-1 text-[11px] text-slate-300">
                          {formatDate(
                            activity.createdAt
                          )}
                        </p>

                      </div>

                    </div>
                  );
                }
              )

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Overview;
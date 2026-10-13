import React from 'react';
import { useAnalysis } from '../../api/queries/useSuperAdmin';
import {
  Wallet,
  Building2,
  Ticket,
  Percent,
  Calendar,
  BarChart3,
  PieChart,
  Trophy,
  Medal,
  AlertCircle,
  Loader2,
  Store,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Tooltip for Revenue Breakdown Pie Chart — light card, no shadow
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-sans">
        <p className="font-semibold text-slate-700 capitalize">{name}</p>
        <p className="text-yellow-600 font-bold mt-0.5">
          PKR {(value || 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip for Company Performance Bar Chart — dark card, no shadow
const CompanyBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] text-white text-xs p-3 rounded-xl border border-white/10 font-sans space-y-1">
        <p className="font-semibold text-slate-200">{data.name}</p>
        <p className="text-yellow-400 font-medium">
          Revenue: PKR {(data.revenue || 0).toLocaleString()}
        </p>
        <p className="text-yellow-300 font-medium">
          Commission: PKR {(data.commission || 0).toLocaleString()}
        </p>
        <p className="text-slate-300">Bookings: {data.bookings || 0}</p>
      </div>
    );
  }
  return null;
};

export default function Analysis() {
  const { data, isLoading, isError, refetch } = useAnalysis();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-yellow-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700 mt-6">
          Loading Platform Analytics...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Aggregating revenue, bookings, and company metrics
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">
            Unable to Load Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Failed to fetch intelligence metrics from the server.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-yellow-300 text-slate-900 font-semibold text-xs py-2.5 px-4 border border-yellow-400/40 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const analytics = data?.data || {};
  const kpis = analytics.kpis || {};
  const companyPerformance = analytics.companyPerformance || {};
  const revenuePerformance = analytics.revenuePerformance || {};

  const totalPlatformRevenue = kpis.totalPlatformRevenue || 0;
  const bookingCommission = kpis.bookingCommission || 0;
  const subscriptionRevenue = kpis.subscriptionRevenue || 0;
  const totalBookingValue = kpis.totalBookingValue || 0;
  const totalPayouts = kpis.totalPayoutsToCompanies || 0;
  const totalTransactions = kpis.totalTransactions || 0;
  const effectiveCommissionRate = kpis.effectiveCommissionRate || 0;

  const topCompanies = companyPerformance.topCompanies || [];
  const totalActiveCompanies = companyPerformance.totalActiveCompanies || 0;

  const formatPKR = (val = 0) => `PKR ${Number(val).toLocaleString()}`;

  const revenueBreakdownData = [
    { name: 'Commission', value: bookingCommission },
    { name: 'Subscriptions', value: subscriptionRevenue },
  ];
  // Yellow + black only
  const PIE_COLORS = ['#FACC15', '#1a1a1a'];

  const getCompanyName = (c, defaultIndex) => {
    return (
      c.companyName ||
      c.name ||
      c.company?.name ||
      c.companyDetails?.name ||
      `Company ${c._id ? c._id.slice(-4) : defaultIndex + 1}`
    );
  };

  const companyChartData = topCompanies.map((c, i) => ({
    name: getCompanyName(c, i),
    revenue: c.totalRevenue || 0,
    commission: c.totalCommission || 0,
    bookings: c.totalBookings || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-1 py-2 space-y-4 sm:space-y-5 min-w-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900">
            Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Comprehensive overview of revenue, bookings, and company performance across TourismOS.
          </p>
        </div>
      </div>

      {/* KPI TOP CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-6">
        {/* Platform Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                Platform Revenue
              </span>
              <p className="text-xl sm:text-2xl font-bold font-sans text-slate-900 mt-2 break-words">
                {formatPKR(totalPlatformRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-400/30 border border-yellow-300/50 flex items-center justify-center text-yellow-700 shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between gap-2 flex-wrap">
            <span>Comm: {formatPKR(bookingCommission)}</span>
            <span>Subs: {formatPKR(subscriptionRevenue)}</span>
          </div>
        </div>

        {/* Booking Volume */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                Booking Volume
              </span>
              <p className="text-xl sm:text-2xl font-bold font-sans text-slate-900 mt-2 break-words">
                {formatPKR(totalBookingValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-yellow-500/20 flex items-center justify-center text-amber-700 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between gap-2 flex-wrap">
            <span>{totalTransactions} transactions</span>
            <span>Payouts: {formatPKR(totalPayouts)}</span>
          </div>
        </div>

        {/* Active Companies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Active Companies
              </span>
              <p className="text-xl sm:text-2xl font-bold font-sans text-slate-900 mt-2 break-words">
                {totalActiveCompanies}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a]/5 border border-[#1a1a1a]/15 flex items-center justify-center text-[#1a1a1a] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between gap-2 flex-wrap">
            <span>Total Companies: {topCompanies.length}</span>
            <span>
              Active:{' '}
              {((totalActiveCompanies / (topCompanies.length || 1)) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-500">
                Avg Commission Rate
              </span>
              <p className="text-xl sm:text-2xl font-bold font-sans text-yellow-600 mt-2 break-words">
                {effectiveCommissionRate.toFixed(2)}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-300/30 border border-yellow-300/50 flex items-center justify-center text-yellow-700 shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between gap-2 flex-wrap">
            <span>Industry avg: 8-15%</span>
            <span className="text-emerald-600 font-semibold">Healthy Rate</span>
          </div>
        </div>
      </div>

      {/* REVENUE BREAKDOWN & COMPANY PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col min-w-0">
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 inline-flex items-center gap-2">
              <PieChart className="w-5 h-5 text-yellow-500" />
              Revenue Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Commission vs Subscriptions</p>
          </div>

          <div className="relative w-full h-[200px] my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={revenueBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-900">
                PKR {(totalPlatformRevenue / 1000).toFixed(0)}k
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100">
            <div className="p-2 rounded-xl bg-yellow-300/20 border border-yellow-300/40 min-w-0">
              <span className="text-[10px] font-semibold uppercase text-white block bg-yellow-400">
                Commission
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 break-words">
                {formatPKR(bookingCommission)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-black/10 border border-amber-500/20 min-w-0">
              <span className="text-[10px] font-semibold uppercase text-white bg-black block">
                Subscriptions
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 break-words">
                {formatPKR(subscriptionRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Company Performance Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0">
              <h3 className="text-base font-bold font-serif text-slate-900 inline-flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                Company Output
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Revenue vs Commission generated by top companies
              </p>
            </div>
          </div>

          <div className="h-[220px] sm:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={companyChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `PKR ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={<CompanyBarTooltip />}
                  cursor={{ fill: 'rgba(250, 204, 21, 0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#FACC15"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="commission"
                  name="Commission"
                  fill="#1a1a1a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TOP COMPANIES TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold font-serif text-slate-900 inline-flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Performing Companies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by total revenue generated</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-300/30 border border-yellow-300/50 text-yellow-800 text-[10px] font-bold whitespace-nowrap shrink-0">
            {topCompanies.length} Companies
          </span>
        </div>

        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="bg-amber-500/5 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 whitespace-nowrap">#</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Company Name</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap">Total Revenue</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap">Bookings</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap">Avg Value</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topCompanies.length > 0 ? (
                topCompanies.map((company, index) => {
                  const isEarning = company.totalRevenue > 0;
                  const companyName = getCompanyName(company, index);

                  return (
                    <tr key={company._id || index}>
                      <td className="py-4 px-6 font-semibold text-slate-500">
                        {index === 0 ? (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="w-4 h-4 text-slate-400" />
                        ) : index === 2 ? (
                          <Medal className="w-4 h-4 text-yellow-400" />
                        ) : (
                          `#${index + 1}`
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <Store className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[220px]">{companyName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">
                        {isEarning ? formatPKR(company.totalRevenue) : '—'}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-slate-700">
                        {company.totalBookings || 0}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-700">
                        {company.avgBookingValue ? formatPKR(company.avgBookingValue) : '—'}
                      </td>
                      <td className="py-4 px-6 text-right text-yellow-600 font-medium">
                        {company.totalCommission ? formatPKR(company.totalCommission) : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No active company records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
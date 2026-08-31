import React from 'react';
import { useAnalysis } from '../../api/queries/useSuperAdmin';
import {
  Wallet,
  Building2,
  Ticket,
  Percent,
  Crown,
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

// Custom Tooltip for Revenue Breakdown Pie Chart
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold text-slate-200 capitalize">{name}</p>
        <p className="text-amber-primary font-bold mt-0.5">PKR {(value || 0).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Company Performance Bar Chart
const CompanyBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-800 font-sans space-y-1">
        <p className="font-semibold text-slate-200">{data.name}</p>
        <p className="text-amber-primary font-medium">Revenue: PKR {(data.revenue || 0).toLocaleString()}</p>
        <p className="text-purple-400 font-medium">Commission: PKR {(data.commission || 0).toLocaleString()}</p>
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
          <div className="w-16 h-16 border-4 border-amber-light border-t-amber-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-amber-primary animate-spin" />
          </div>
        </div>
        <p className="text-sm font-medium text-text-secondary mt-6">Loading Platform Analytics...</p>
        <p className="text-xs text-text-muted mt-1">Aggregating revenue, bookings, and company metrics</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50/80 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-error" />
          </div>
          <h3 className="text-base font-bold text-text-primary font-serif">Unable to Load Analytics</h3>
          <p className="text-xs text-text-muted mt-1">Failed to fetch intelligence metrics from the server.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-5 btn-yellow text-xs py-2.5 px-4 gap-2"
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
  const PIE_COLORS = ['#F59E0B', '#8B5CF6'];

  const getCompanyName = (c, defaultIndex) => {
    return c.companyName || c.name || c.company?.name || c.companyDetails?.name || `Company ${c._id ? c._id.slice(-4) : defaultIndex + 1}`;
  };

  const companyChartData = topCompanies.map((c, i) => ({
    name: getCompanyName(c, i),
    revenue: c.totalRevenue || 0,
    commission: c.totalCommission || 0,
    bookings: c.totalBookings || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-text-primary">
            Platform Analytics
          </h1>
          <p className="subheading text-xs mt-1">
            Comprehensive overview of revenue, bookings, and company performance across TourismOS.
          </p>
        </div>

       
      </div>

      {/* KPI TOP CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Platform Revenue */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Platform Revenue
              </span>
              <p className="text-2xl font-bold font-sans text-text-primary mt-2">
                {formatPKR(totalPlatformRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-light/70 border border-amber-200 flex items-center justify-center text-amber-primary">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-light text-[10px] text-text-muted flex justify-between">
            <span>Comm: {formatPKR(bookingCommission)}</span>
            <span>Subs: {formatPKR(subscriptionRevenue)}</span>
          </div>
        </div>

        {/* Booking Volume */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Booking Volume
              </span>
              <p className="text-2xl font-bold font-sans text-text-primary mt-2">
                {formatPKR(totalBookingValue)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-700">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-light text-[10px] text-text-muted flex justify-between">
            <span>{totalTransactions} transactions</span>
            <span>Payouts: {formatPKR(totalPayouts)}</span>
          </div>
        </div>

        {/* Active Companies */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Active Companies
              </span>
              <p className="text-2xl font-bold font-sans text-text-primary mt-2">
                {totalActiveCompanies}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-light text-[10px] text-text-muted flex justify-between">
            <span>Total Companies: {topCompanies.length}</span>
            <span>Active: {((totalActiveCompanies / (topCompanies.length || 1)) * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Avg Commission Rate
              </span>
              <p className="text-2xl font-bold font-sans text-purple-700 mt-2">
                {effectiveCommissionRate.toFixed(2)}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100/70 border border-purple-200 flex items-center justify-center text-purple-700">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-light text-[10px] text-text-muted flex justify-between">
            <span>Industry avg: 8-15%</span>
            <span className="text-success font-semibold">Healthy Rate</span>
          </div>
        </div>

      </div>

      {/* REVENUE BREAKDOWN & COMPANY PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div>
            <h3 className="text-base font-bold font-serif text-text-primary inline-flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-primary" />
              Revenue Breakdown
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Commission vs Subscriptions</p>
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
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-text-primary">
                PKR {(totalPlatformRevenue / 1000).toFixed(0)}k
              </span>
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-border-light">
            <div className="p-2 rounded-xl bg-amber-light/50 border border-amber-200/60">
              <span className="text-[10px] font-semibold uppercase text-amber-800 block">Commission</span>
              <p className="text-xs font-bold text-text-primary mt-0.5">{formatPKR(bookingCommission)}</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] font-semibold uppercase text-purple-800 block">Subscriptions</span>
              <p className="text-xs font-bold text-text-primary mt-0.5">{formatPKR(subscriptionRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Company Performance Bar Chart */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-serif text-text-primary inline-flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Company Output
              </h3>
              <p className="text-xs text-text-muted mt-0.5">Revenue vs Commission generated by top companies</p>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `PKR ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CompanyBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" name="Commission" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TOP COMPANIES TABLE */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="p-6 border-b border-border-light flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif text-text-primary inline-flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-primary" />
              Top Performing Companies
            </h3>
            <p className="text-xs text-text-muted mt-0.5">Ranked by total revenue generated</p>
          </div>
          <span className="badge-yellow">{topCompanies.length} Companies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-muted font-semibold border-b border-border-subtle uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">#</th>
                <th className="py-3.5 px-6">Company Name</th>
                <th className="py-3.5 px-6 text-right">Total Revenue</th>
                <th className="py-3.5 px-6 text-right">Bookings</th>
                <th className="py-3.5 px-6 text-right">Avg Value</th>
                <th className="py-3.5 px-6 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {topCompanies.length > 0 ? (
                topCompanies.map((company, index) => {
                  const isEarning = company.totalRevenue > 0;
                  const companyName = getCompanyName(company, index);

                  return (
                    <tr key={company._id || index} className="hover:bg-bg-secondary/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-text-muted">
                        {index === 0 ? <Trophy className="w-4 h-4 text-amber-primary" /> :
                         index === 1 ? <Medal className="w-4 h-4 text-slate-400" /> :
                         index === 2 ? <Medal className="w-4 h-4 text-amber-700" /> :
                         `#${index + 1}`}
                      </td>
                      <td className="py-4 px-6 font-semibold text-text-primary">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-text-muted" />
                          <span>{companyName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-text-primary">
                        {isEarning ? formatPKR(company.totalRevenue) : '—'}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-text-secondary">
                        {company.totalBookings || 0}
                      </td>
                      <td className="py-4 px-6 text-right text-text-secondary">
                        {company.avgBookingValue ? formatPKR(company.avgBookingValue) : '—'}
                      </td>
                      <td className="py-4 px-6 text-right text-amber-primary font-medium">
                        {company.totalCommission ? formatPKR(company.totalCommission) : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-text-muted">
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
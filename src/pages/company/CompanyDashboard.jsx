import React from 'react';
import { useCompanyDashboard, useCreditHistory } from '../../api/queries/useCompany';

export default function CompanyDashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading, isError } = useCompanyDashboard();
//   const { data: creditHistory, isLoading: isCreditsLoading } = useCreditHistory();

  if (isDashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-sans">
        Failed to load company dashboard data. Please refresh or check API connection.
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalTours: 0,
    activeBookings: 0,
    totalRevenue: '$0',
    availableCredits: 0,
  };

  return (
    <div className="space-y-8 p-6 md:p-8 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Company Overview</h1>
          <p className="subheading text-slate-500 text-sm mt-1">
            Manage your tours, track bookings, and monitor credit transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-outline text-sm py-2.5">
            View Analytics
          </button>
          <button className="btn-yellow text-sm py-2.5">
            + Create New Tour
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
            Total Tours
          </span>
          <div className="text-3xl font-bold text-slate-900 font-sans">
            {stats.totalTours}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
            Active Bookings
          </span>
          <div className="text-3xl font-bold text-slate-900 font-sans">
            {stats.activeBookings}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
            Total Revenue
          </span>
          <div className="text-3xl font-bold text-slate-900 font-sans">
            {stats.totalRevenue}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-sans">
            Platform Credits
          </span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-amber-900 font-sans">
              {stats.availableCredits}
            </span>
            <span className="badge-yellow">Active</span>
          </div>
        </div>
      </div>

      {/* Credit History Table Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-serif">Recent Credit History</h2>
          <span className="text-xs text-slate-500 font-sans">Updated just now</span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isCreditsLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Loading credit history...
                  </td>
                </tr>
              ) : creditHistory?.data?.length > 0 ? (
                creditHistory.data.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">{item._id}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{item.description || 'Credit Purchase'}</td>
                    <td className={`py-4 px-6 font-semibold ${item.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </td>
                    <td className="py-4 px-6 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="badge-yellow">Completed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No credit history transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
}
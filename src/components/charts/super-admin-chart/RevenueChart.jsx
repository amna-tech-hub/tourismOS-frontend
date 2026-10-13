// src/components/charts/super-admin-chart/RevenueChart.jsx

import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart,
} from 'recharts';

const RevenueChart = ({ data }) => {
  // Format data for chart
  const chartData = data.map((item) => ({
    month: `${item.month} ${item.year}`,
    // 🆕 Platform Revenue (commission + subscriptions)
    platformRevenue: item.platformRevenue || 0,
    // 🆕 Commission Revenue
    commissionRevenue: item.commissionRevenue || 0,
    // 🆕 Subscription Revenue
    subscriptionRevenue: item.subscriptionRevenue || 0,
    // 🆕 Context: Total booking value (for reference)
    totalBookingValue: item.totalBookingValue || 0,
  }));

  // Custom tooltip — flat light card, no shadow
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="font-semibold text-slate-900">{label}</p>

          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className="font-medium text-yellow-600">Platform Revenue:</span>
              <span className="ml-2 text-slate-700">
                PKR {data.platformRevenue.toLocaleString()}
              </span>
            </p>

            <p className="text-xs">
              <span className="font-medium text-slate-700">Commission:</span>
              <span className="ml-2 text-slate-700">
                PKR {data.commissionRevenue.toLocaleString()}
              </span>
            </p>

            <p className="text-xs">
              <span className="font-medium text-slate-500">Subscriptions:</span>
              <span className="ml-2 text-slate-700">
                PKR {data.subscriptionRevenue.toLocaleString()}
              </span>
            </p>

            <div className="border-t border-slate-100 mt-1 pt-1">
              <p className="text-[10px] text-slate-400">
                Booking value: PKR {data.totalBookingValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />

        <YAxis
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}k`}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />

        {/* Area for total platform revenue — yellow */}
        <Area
          type="monotone"
          dataKey="platformRevenue"
          fill="#facc15"
          fillOpacity={0.15}
          stroke="#facc15"
          strokeWidth={2}
          name="Platform Revenue"
        />

        {/* Commission revenue — black */}
        <Line
          type="monotone"
          dataKey="commissionRevenue"
          stroke="#1a1a1a"
          strokeWidth={2}
          dot={{ r: 3, fill: '#1a1a1a', stroke: '#1a1a1a' }}
          name="Commission"
        />

        {/* Subscription revenue — muted slate */}
        <Line
          type="monotone"
          dataKey="subscriptionRevenue"
          stroke="#94A3B8"
          strokeWidth={2}
          dot={{ r: 3, fill: '#94A3B8', stroke: '#94A3B8' }}
          name="Subscriptions"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
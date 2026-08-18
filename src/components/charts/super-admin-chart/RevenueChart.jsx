// src/components/charts/super-admin-chart/RevenueChart.jsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

const RevenueChart = ({ data }) => {
  // Format data for chart
  const chartData = data.map(item => ({
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className="font-medium text-emerald-600">Platform Revenue:</span>
              <span className="ml-2">PKR {data.platformRevenue.toLocaleString()}</span>
            </p>
            <p className="text-xs">
              <span className="font-medium text-blue-600">Commission:</span>
              <span className="ml-2">PKR {data.commissionRevenue.toLocaleString()}</span>
            </p>
            <p className="text-xs">
              <span className="font-medium text-purple-600">Subscriptions:</span>
              <span className="ml-2">PKR {data.subscriptionRevenue.toLocaleString()}</span>
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
        <Legend
          wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
        />
        
        {/* 🆕 Area for total platform revenue */}
        <Area
          type="monotone"
          dataKey="platformRevenue"
          fill="#fbbf24"
          fillOpacity={0.1}
          stroke="#f59e0b"
          strokeWidth={2}
          name="Platform Revenue"
        />
        
        {/* Commission revenue */}
        <Line
          type="monotone"
          dataKey="commissionRevenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Commission"
        />
        
        {/* Subscription revenue */}
        <Line
          type="monotone"
          dataKey="subscriptionRevenue"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Subscriptions"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
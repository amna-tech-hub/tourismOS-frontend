import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Status Color Palette matching light SaaS theme
const STATUS_COLORS = {
  confirmed: '#10B981', // Emerald Success
  pending: '#F59E0B',   // Amber Warning
  completed: '#3B82F6', // Blue Primary
  cancelled: '#EF4444', // Red Error
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold capitalize text-slate-200">{status}</p>
        <p className="text-amber-400 font-bold mt-0.5">{count} Bookings</p>
      </div>
    );
  }
  return null;
};

export default function BookingOverviewChart({ data = [] }) {
  // Ensure default zero-filled items if data is empty
  const defaultData = [
    { status: 'confirmed', count: 0 },
    { status: 'pending', count: 0 },
    { status: 'completed', count: 0 },
    { status: 'cancelled', count: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const totalBookings = chartData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="w-full flex flex-col items-center justify-between font-sans">
      <div className="relative w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
              nameKey="status"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || '#94A3B8'}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900">{totalBookings}</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-3 w-full pt-4 border-t border-slate-100 text-xs">
        {chartData.map((item) => {
          const percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
          return (
            <div key={item.status} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.status] || '#94A3B8' }}
                />
                <span className="capitalize font-medium text-slate-700">{item.status}</span>
              </div>
              <span className="font-bold text-slate-900">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
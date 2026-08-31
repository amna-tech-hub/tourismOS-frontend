import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Updated Color Palette - Yellow/White Theme
const STATUS_COLORS = {
  confirmed: '#10B981', // Emerald Green - Success
  pending: '#F59E0B',   // Yellow - Primary Brand Color
  completed: '#3B82F6', // Blue - Info
  cancelled: '#EF4444', // Rose Red - Error
};

// Custom Tooltip Component - Light Theme
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-white text-slate-900 text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 font-sans">
        <p className="font-semibold capitalize text-slate-700">{status}</p>
        <p className="text-yellow-600 font-bold mt-0.5">{count} Bookings</p>
      </div>
    );
  }
  return null;
};

export default function BookingOverviewChart({ data = [] }) {
  const defaultData = [
    { status: 'confirmed', count: 0 },
    { status: 'pending', count: 0 },
    { status: 'completed', count: 0 },
    { status: 'cancelled', count: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const totalBookings = chartData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="w-full flex flex-col items-center justify-between font-sans ">
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
      <div className="grid grid-cols-2 gap-3 w-full pt-2 border-t border-slate-100 text-xs">
        {chartData.map((item) => {
          const percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
          const color = STATUS_COLORS[item.status] || '#94A3B8';
          
          return (
            <div 
              key={item.status} 
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="capitalize font-medium text-slate-700 text-xs">
                  {item.status}
                </span>
              </div>
              <span className="font-bold text-slate-900 text-xs">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
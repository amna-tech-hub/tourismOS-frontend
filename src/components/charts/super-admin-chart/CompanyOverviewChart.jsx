import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Status Color Palette
const COMPANY_COLORS = {
  active: '#10B981',    // Emerald Green
  inactive: '#94A3B8',  // Slate Gray
  suspended: '#EF4444', // Red Accent
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold capitalize text-slate-200">{status} Companies</p>
        <p className="text-amber-400 font-bold mt-0.5">{count} Registered</p>
      </div>
    );
  }
  return null;
};

export default function CompanyOverviewChart({ data = [] }) {
  const defaultData = [
    { status: 'active', count: 0 },
    { status: 'inactive', count: 0 },
    { status: 'suspended', count: 0 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="w-full flex flex-col justify-between font-sans">
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="status"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COMPANY_COLORS[entry.status] || '#CBD5E1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-around pt-4 border-t border-slate-100 text-xs">
        {chartData.map((item) => (
          <div key={item.status} className="text-center">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">
              {item.status}
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
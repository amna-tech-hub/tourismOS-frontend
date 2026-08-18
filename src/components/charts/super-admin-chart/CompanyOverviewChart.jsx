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

// Blue & Yellow Color Palette - Matching your theme
const COMPANY_COLORS = {
  active: '#F59E0B',    // Amber/Yellow - Primary
  inactive: '#93C5FD',  // Blue Light
  suspended: '#2563EB', // Blue Primary
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended'
    };
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-800 font-sans">
        <p className="font-semibold capitalize text-amber-400">{labels[status] || status}</p>
        <p className="text-blue-400 font-bold mt-0.5">{count} Registered</p>
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

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: '●',
      inactive: '○',
      suspended: '◉'
    };
    return icons[status] || '●';
  };

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
              tick={{ 
                fill: '#0F172A', 
                fontSize: 12, 
                fontWeight: 600,
                fontFamily: 'Outfit, system-ui, sans-serif'
              }}
              tickFormatter={(value) => getStatusLabel(value)}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FEF3C7', opacity: 0.3 }} />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]} 
              barSize={24}
              label={{
                position: 'right',
                fill: '#0F172A',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Outfit, system-ui, sans-serif',
                formatter: (value) => value > 0 ? value : '',
                offset: 5
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COMPANY_COLORS[entry.status] || '#93C5FD'}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-blue-200/40">
        {chartData.map((item) => {
          const color = COMPANY_COLORS[item.status] || '#93C5FD';
          const label = getStatusLabel(item.status);
          const icon = getStatusIcon(item.status);
          
          return (
            <div 
              key={item.status} 
              className="text-center p-2 rounded-xl bg-blue-50/30 border border-blue-200/30 hover:bg-amber-50/40 transition-colors"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-sm" style={{ color }}>
                  {icon}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {label}
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900 block" style={{ color }}>
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
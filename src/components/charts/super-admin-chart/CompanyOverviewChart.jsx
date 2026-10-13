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

// Yellow / Black / Muted palette
const COMPANY_COLORS = {
  active: '#FACC15',    // Yellow-400 — brand accent
  inactive: '#94A3B8',  // Slate-400 — muted
  suspended: '#1a1a1a', // Black — replaces rose
};

// Custom Tooltip — flat light card, no shadow
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
    };
    return (
      <div className="bg-white text-slate-900 text-xs px-4 py-2.5 rounded-xl border border-slate-200 font-sans">
        <p className="font-semibold capitalize text-yellow-600">
          {labels[status] || status}
        </p>
        <p className="text-slate-700 font-bold mt-0.5">{count} Companies</p>
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
      suspended: 'Suspended',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: '●',
      inactive: '○',
      suspended: '◉',
    };
    return icons[status] || '●';
  };

  return (
    <div className="w-full flex flex-col justify-between font-sans min-w-0">
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
                fill: '#1E293B',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Outfit, system-ui, sans-serif',
              }}
              tickFormatter={(value) => getStatusLabel(value)}
              width={80}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(250, 204, 21, 0.08)' }}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              barSize={24}
              label={{
                position: 'right',
                fill: '#1E293B',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Outfit, system-ui, sans-serif',
                formatter: (value) => (value > 0 ? value : ''),
                offset: 5,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COMPANY_COLORS[entry.status] || '#94A3B8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        {chartData.map((item) => {
          const color = COMPANY_COLORS[item.status] || '#94A3B8';
          const label = getStatusLabel(item.status);
          const icon = getStatusIcon(item.status);

          return (
            <div
              key={item.status}
              className="text-center p-2.5 rounded-xl bg-amber-500/5 border border-slate-200 min-w-0"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-sm shrink-0" style={{ color }}>
                  {icon}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                  {label}
                </span>
              </div>
              <span
                className="text-2xl font-bold block"
                style={{ color }}
              >
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
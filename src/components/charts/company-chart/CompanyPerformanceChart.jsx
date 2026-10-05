import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function CompanyPerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-slate-900">
            Company Performance
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            Compare tours published, drafts and reviews across companies.
          </p>
        </div>

        <div className="h-[320px] flex items-center justify-center">
          <p className="text-xs text-slate-400">
            No company performance data available.
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.map((company) => ({
    name:
      company.companyName?.length > 18
        ? `${company.companyName.substring(0, 18)}...`
        : company.companyName,

    totalTours: company.totalTours || 0,

    publishedTours: company.publishedTours || 0,

    draftTours: company.draftTours || 0,

    reviews: company.totalReviews || 0,

    rating: company.averageRating || 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Company Performance
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            Compare tour activity and customer reviews across the top companies.
          </p>
        </div>

        <div className="text-[10px] text-slate-400">
          Top {data.length} companies
        </div>
      </div>

      {/* Chart */}

      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 55,
            }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{
                fontSize: 10,
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 10,
              }}
            />

            <Tooltip
              cursor={{
                fill: "rgba(15, 23, 42, 0.04)",
              }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "11px",
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "10px",
              }}
            />

            <Bar
              dataKey="totalTours"
              name="Total Tours"
              fill="#0f172a"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />

            <Bar
              dataKey="publishedTours"
              name="Published"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />

            <Bar
              dataKey="draftTours"
              name="Draft"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Review summary */}

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.slice(0, 4).map((company) => (
            <div
              key={company._id}
              className="bg-slate-50 rounded-xl p-3 border border-slate-100"
            >
              <p className="text-[10px] text-slate-400 truncate">
                {company.companyName}
              </p>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {company.totalReviews || 0}
                  </p>

                  <p className="text-[9px] text-slate-400">Reviews</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-400">
                    ★ {Number(company.averageRating || 0).toFixed(1)}
                  </p>

                  <p className="text-[9px] text-slate-400">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

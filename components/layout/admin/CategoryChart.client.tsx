"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryChartProps {
  data: Array<{
    category: string;
    revenue: number;
    products: number;
  }>;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function CategoryChartClient({
  data,
}: CategoryChartProps): React.ReactElement {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Category Performance
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🥧</div>
            <p>No category data available</p>
            <p className="text-sm">Data will appear here once products are categorized and orders are placed</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    value: item.revenue,
    products: item.products,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Category Performance
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) =>
                `${name} ${((percent as number) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [
                `₦${value.toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details */}
      <div className="mt-6 space-y-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                ₦{item.value.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({item.products} products)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

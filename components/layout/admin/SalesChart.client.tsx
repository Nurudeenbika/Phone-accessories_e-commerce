"use client";

import React from "react";
import { GraphData } from "@/lib/jespo/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: GraphData[];
}

export default function SalesChartClient({
  data,
}: SalesChartProps): React.ReactElement {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Sales Overview
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No sales data available</p>
            <p className="text-sm">
              Data will appear here once orders are placed
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((item) => ({
    day: item.day?.substring(0, 3) || "N/A", // Short day name
    fullDay: item.day || "N/A",
    revenue: Number(item.totalAmount) || 0,
    orders: Number(item.totalOrders) || 0,
  }));

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Sales Overview
      </h3>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: any, name?: string) => [
                name === "revenue" ? `₦${value.toLocaleString()}` : value,
                name === "revenue" ? "Revenue" : "Orders",
              ]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="orders"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {totalRevenue.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
      </div>
    </div>
  );
}

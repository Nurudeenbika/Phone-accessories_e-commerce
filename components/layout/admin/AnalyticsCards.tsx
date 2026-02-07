"use client";

import React from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdTrendingUp,
  MdPeople,
} from "react-icons/md";

interface AnalyticsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
}

export default function AnalyticsCards({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  conversionRate,
}: AnalyticsCardsProps): React.ReactElement {
  const safeRevenue = Number(totalRevenue.toFixed(2));
  const safeAOV = Number(averageOrderValue.toFixed(2));
  const safeConversion = Number(conversionRate.toFixed(1));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {safeRevenue.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-green-600 mt-1">
              +12.5% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <MdAttachMoney className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-sm text-blue-600 mt-1">+8.2% from last month</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <MdShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Average Order Value */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Avg Order Value
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {safeAOV.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              +3.1% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <MdTrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Conversion Rate
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {safeConversion}%
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              +0.5% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
            <MdPeople className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

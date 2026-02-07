"use client";

import React from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdCheckCircle,
  MdSchedule,
  MdTrendingUp,
  MdSearch,
  MdFilterList,
  MdAnalytics,
  MdSettings,
  MdStorefront,
  MdInventory2,
} from "react-icons/md";

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  iconName: string;
  color?: "blue" | "green" | "yellow" | "purple" | "red";
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  money: MdAttachMoney,
  cart: MdInventory2, // Box icon for orders
  inventory: MdInventory,
  people: MdPeople,
  check: MdCheckCircle,
  schedule: MdSchedule,
  trending: MdTrendingUp,
  search: MdSearch,
  filter: MdFilterList,
  analytics: MdAnalytics,
  settings: MdSettings,
  store: MdStorefront,
  orders: MdInventory2, // Box icon for orders
};

export default function DashboardCard({
  title,
  value,
  change,
  iconName,
  color = "blue",
}: DashboardCardProps): React.ReactElement {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };

  const changeColorClasses = {
    increase: "text-green-600 bg-green-50",
    decrease: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

          {change && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${changeColorClasses[change.type]}`}
            >
              <span>
                {change.type === "increase" && "↗"}
                {change.type === "decrease" && "↘"}
                {change.type === "neutral" && "→"}
              </span>
              <span>{change.value}</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {(() => {
            const IconComponent = iconMap[iconName];
            return IconComponent ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6 text-2xl">{iconName}</div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

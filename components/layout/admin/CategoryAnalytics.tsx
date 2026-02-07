"use client";

import React from "react";
import { ProductAttributes } from "@/models/product.model";
import { OrderAttributes } from "@/models/order.model";
import { MdCategory, MdTrendingUp } from "react-icons/md";

interface CategoryAnalyticsProps {
  products: ProductAttributes[];
  orders: OrderAttributes[];
}

export default function CategoryAnalytics({
  products,
  orders,
}: CategoryAnalyticsProps): React.ReactElement {
  // Handle empty data
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdCategory className="w-5 h-5 text-purple-600" />
          Category Performance
        </h3>
        <div className="text-center py-8">
          <MdCategory className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            No category data available
          </p>
        </div>
      </div>
    );
  }

  // Calculate category performance with proper null checks
  const categoryStats = products.reduce(
    (acc, product) => {
      const category = product.category || "Uncategorized";

      if (!acc[category]) {
        acc[category] = {
          category,
          products: 0,
          sales: 0,
          revenue: 0,
        };
      }

      acc[category].products += 1;

      // Calculate sales for this product
      const productSales = (orders || []).reduce((total, order) => {
        // Parse products if it's a string
        let orderProducts = order.products || [];
        if (typeof orderProducts === "string") {
          try {
            orderProducts = JSON.parse(orderProducts);
          } catch (e) {
            orderProducts = [];
          }
        }

        const productOrders = orderProducts.filter(
          (item: any) =>
            item.id === parseInt(product.id || "0") ||
            item.productId === product.id,
        );
        return (
          total +
          productOrders.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0,
          )
        );
      }, 0);

      acc[category].sales += productSales;
      acc[category].revenue += productSales * (product.price || 0);

      return acc;
    },
    {} as Record<
      string,
      { category: string; products: number; sales: number; revenue: number }
    >,
  );

  // Convert to array and sort by revenue
  const categoryData = Object.values(categoryStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const maxRevenue = Math.max(...categoryData.map((c) => c.revenue), 1);

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MdCategory className="w-5 h-5 text-purple-600" />
        Category Performance
      </h3>

      <div className="space-y-4">
        {categoryData.map((category, index) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {category.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <MdTrendingUp className="w-3 h-3" />
                  <span>{category.sales}</span>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ₦{category.revenue.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(category.revenue / maxRevenue) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{category.products} products</span>
              <span>{category.sales} sold</span>
            </div>
          </div>
        ))}
      </div>

      {categoryData.length === 0 && (
        <div className="text-center py-8">
          <MdCategory className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">
            No category data available
          </p>
        </div>
      )}
    </div>
  );
}

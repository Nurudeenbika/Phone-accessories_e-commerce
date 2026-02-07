"use client";

import React from "react";
import { ProductAttributes } from "@/models/product.model";
import { OrderAttributes } from "@/models/order.model";
import { MdStar, MdTrendingUp } from "react-icons/md";

interface TopProductsProps {
  products: ProductAttributes[];
  orders: OrderAttributes[];
}

export default function TopProducts({
  products,
  orders,
}: TopProductsProps): React.ReactElement {
  // Handle empty data
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdStar className="w-5 h-5 text-yellow-600" />
          Top Selling Products
        </h3>
        <div className="text-center py-8">
          <MdStar className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">No products available</p>
        </div>
      </div>
    );
  }

  // Calculate product sales with proper null checks
  const productSales = products.map((product) => {
    const sales = (orders || []).reduce((total, order) => {
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

    const revenue = (orders || []).reduce((total, order) => {
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
          (sum: number, item: any) =>
            sum + (item.quantity || 0) * (product.price || 0),
          0,
        )
      );
    }, 0);

    return {
      ...product,
      sales,
      revenue,
    };
  });

  // Sort by sales and take top 5
  const topProducts = productSales
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MdStar className="w-5 h-5 text-yellow-600" />
        Top Selling Products
      </h3>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600">
                #{index + 1}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500">
                {product.sales} sold • ₦{product.revenue.toLocaleString()}{" "}
                revenue
              </p>
            </div>

            {/* Sales Indicator */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-green-600">
                <MdTrendingUp className="w-3 h-3" />
                <span>{product.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topProducts.length === 0 && (
        <div className="text-center py-8">
          <MdStar className="mx-auto h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">No sales data available</p>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { LoadingStates } from "@/components/ui/LoadingStates";
import AnalyticsCards from "@/components/layout/admin/AnalyticsCards";
import SalesChart from "@/components/layout/admin/SalesChart";
import RevenueChart from "@/components/layout/admin/RevenueChart";
import CategoryChart from "@/components/layout/admin/CategoryChart";
import OrderStatusChart from "@/components/layout/admin/OrderStatusChart";
import TopProducts from "@/components/layout/admin/TopProducts";
import CategoryAnalytics from "@/components/layout/admin/CategoryAnalytics";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdCategory,
  MdPeople,
} from "react-icons/md";

interface AnalyticsData {
  products: any[];
  orders: any[];
  users: any[];
  graphData: any[];
  categoryData: any[];
  orderStatusData: any[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlyRevenue: Record<string, number>;
}

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const [productsRes, ordersRes, usersRes, graphRes] = await Promise.all([
    fetch("/api/admin/products"),
    fetch("/api/admin/orders"),
    fetch("/api/admin/users"),
    fetch("/api/admin/graph-data"),
  ]);

  const normalizeArray = (res: any): any[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.products)) return res.products;
    if (Array.isArray(res?.orders)) return res.orders;
    if (Array.isArray(res?.users)) return res.users;
    return [];
  };

  const [products, orders, users, graphData] = await Promise.all([
    productsRes.json().then(normalizeArray),
    ordersRes.json().then(normalizeArray),
    usersRes.json().then(normalizeArray),
    graphRes.json().then(normalizeArray),
  ]);

  if (!products.length || !orders.length) {
    console.warn("Analytics: Empty products or orders data");
  }

  // Calculate key metrics with proper number handling
  const totalRevenue = orders.reduce((sum: number, order: any) => {
    const amount =
      typeof order.totalAmount === "string"
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount) || 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate =
    users.length > 0 ? (totalOrders / users.length) * 100 : 0;

  // Monthly revenue calculation with proper number handling
  // const monthlyRevenue = orders.reduce(
  //   (acc: Record<string, number>, order: any) => {
  //     if (order.createdAt) {

  //       const month = new Date(order.createdAt).toLocaleDateString("en-US", {
  //         month: "short",
  //         year: "numeric",
  //       });
  //       const amount =
  //         typeof order.totalAmount === "string"
  //           ? parseFloat(order.totalAmount)
  //           : order.totalAmount || 0;
  //       acc[month] = (acc[month] || 0) + (isNaN(amount) ? 0 : amount);
  //     }
  //     return acc;
  //   },
  //   {},
  // );

  const monthlyRevenue = orders.reduce(
    (acc: Record<string, number>, order: any) => {
      if (!order.createdAt) return acc;

      const month = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const amount = Number(order.totalAmount);

      if (!isNaN(amount)) {
        acc[month] = Number(acc[month] || 0) + amount;
      }

      return acc;
    },
    {},
  );

  // Calculate category data - Fixed approach
  const categoryStats = products.reduce((acc: any, product: any) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        category,
        products: 0,
        revenue: 0,
      };
    }
    acc[category].products += 1;
    return acc;
  }, {});

  // Calculate revenue for each category by analyzing orders
  orders.forEach((order: any) => {
    let orderProducts = order.products || [];
    if (typeof orderProducts === "string") {
      try {
        orderProducts = JSON.parse(orderProducts);
      } catch (e) {
        orderProducts = [];
      }
    }

    // Get the order total amount
    const orderAmount =
      typeof order.totalAmount === "string"
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount) || 0;

    // If we have products in the order, distribute the revenue proportionally
    if (orderProducts.length > 0 && orderAmount > 0) {
      // Group products by category
      const categoryProducts: { [key: string]: any[] } = {};

      orderProducts.forEach((orderProduct: any) => {
        const product = products.find(
          (p: any) =>
            p.id === orderProduct.id ||
            p.id === orderProduct.productId ||
            p.id === parseInt(orderProduct.id) ||
            p.id === parseInt(orderProduct.productId),
        );

        if (product) {
          const category = product.category || "Uncategorized";
          if (!categoryProducts[category]) {
            categoryProducts[category] = [];
          }
          categoryProducts[category].push({
            ...orderProduct,
            productPrice: product.price || 0,
          });
        }
      });

      // Calculate total value for this order
      const totalOrderValue = Object.values(categoryProducts).reduce(
        (sum: number, catProducts: any[]) => {
          return (
            sum +
            catProducts.reduce((catSum: number, item: any) => {
              return catSum + (item.quantity || 0) * (item.productPrice || 0);
            }, 0)
          );
        },
        0,
      );

      // Distribute revenue proportionally to categories
      Object.entries(categoryProducts).forEach(([category, catProducts]) => {
        const categoryValue = catProducts.reduce((sum: number, item: any) => {
          return sum + (item.quantity || 0) * (item.productPrice || 0);
        }, 0);

        if (totalOrderValue > 0) {
          const categoryRevenue =
            (categoryValue / totalOrderValue) * orderAmount;
          if (categoryStats[category]) {
            categoryStats[category].revenue += categoryRevenue;
          }
        }
      });
    }
  });

  const categoryData = Object.values(categoryStats);

  // Calculate order status data
  const orderStatusStats = orders.reduce((acc: any, order: any) => {
    const status = order.status || "pending";
    if (!acc[status]) {
      acc[status] = { status, count: 0 };
    }
    acc[status].count += 1;
    return acc;
  }, {});

  const orderStatusData = Object.values(orderStatusStats).map((item: any) => ({
    ...item,
    percentage: totalOrders > 0 ? (item.count / totalOrders) * 100 : 0,
  }));

  return {
    products,
    orders,
    users,
    graphData,
    categoryData,
    orderStatusData,
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    monthlyRevenue,
  };
}

export default function AnalyticsClient() {
  const { data, isLoading, isRefetching, error } = useAdminData(
    fetchAnalyticsData,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      enableBackgroundRefetch: true,
    },
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your store&#39;s performance and insights
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Analytics
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadingStates isLoading={isLoading} isRefetching={isRefetching}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your store&#39;s performance and insights
          </p>
        </div>

        {data && (
          <>
            {/* Key Metrics Cards */}
            <AnalyticsCards
              totalRevenue={data.totalRevenue}
              totalOrders={data.totalOrders}
              averageOrderValue={data.averageOrderValue}
              conversionRate={data.conversionRate}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="lg:col-span-2">
                <SalesChart data={data.graphData || []} />
              </div>

              {/* Revenue Chart */}
              <div className="lg:col-span-1">
                <RevenueChart data={data.graphData || []} />
              </div>

              {/* Category Chart */}
              <div className="lg:col-span-1">
                <CategoryChart data={data.categoryData || []} />
              </div>

              {/* Order Status Chart */}
              <div className="lg:col-span-1">
                <OrderStatusChart data={data.orderStatusData || []} />
              </div>

              {/* Top Products */}
              <div className="lg:col-span-1">
                <TopProducts products={data.products} orders={data.orders} />
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Month */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdAttachMoney className="w-5 h-5 text-green-600" />
                  Revenue by Month
                </h3>
                <div className="space-y-3">
                  {Object.entries(data.monthlyRevenue)
                    .sort(
                      ([a], [b]) =>
                        new Date(a).getTime() - new Date(b).getTime(),
                    )
                    .map(([month, revenue]) => (
                      <div
                        key={month}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600">{month}</span>
                        <span className="text-sm font-medium text-gray-900">
                          ₦{revenue.toFixed(2).toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MdPeople className="w-5 h-5 text-purple-600" />
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {data.users.slice(0, 5).map((user: any, index: number) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">
                          #{user.id?.substring(0, 8) || "N/A"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "Unnamed User"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </LoadingStates>
  );
}

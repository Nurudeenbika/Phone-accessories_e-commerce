"use client";

import React from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { LoadingStates } from "@/components/ui/LoadingStates";
import DashboardCard from "@/components/layout/admin/DashboardCard";
import SalesChart from "@/components/layout/admin/SalesChart";
import { MdAdd, MdInventory, MdPeople, MdAnalytics } from "react-icons/md";

interface DashboardData {
  products: any[];
  orders: any[];
  users: any[];
  graphData: any[];
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalSales: number;
  analytics?: {
    current: {
      totalProducts: number;
      totalOrders: number;
      totalUsers: number;
      totalSales: number;
    };
    changes: {
      products: number;
      orders: number;
      users: number;
      sales: number;
    };
  };
}

async function fetchDashboardData(): Promise<DashboardData> {
  const [productsRes, ordersRes, usersRes, graphRes, analyticsRes] =
    await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/orders"),
      fetch("/api/admin/users"),
      fetch("/api/admin/graph-data"),
      fetch("/api/admin/analytics"),
    ]);

  const normalizeArray = (res: any): any[] => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.products)) return res.products;
    if (Array.isArray(res?.orders)) return res.orders;
    if (Array.isArray(res?.users)) return res.users;
    return [];
  };

  const [products, orders, users, graphData, analytics] = await Promise.all([
    productsRes.json().then(normalizeArray),
    ordersRes.json().then(normalizeArray),
    usersRes.json().then(normalizeArray),
    graphRes.json().then(normalizeArray),
    analyticsRes.json(),
  ]);

  if (!Array.isArray(products)) {
    console.warn("Products is not an array", products);
  }

  // Calculate metrics with proper number handling
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalSales = orders.reduce((sum: number, order: any) => {
    const amount =
      typeof order.totalAmount === "string"
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount) || 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return {
    products,
    orders,
    users,
    graphData,
    totalProducts,
    totalOrders,
    totalUsers,
    totalSales,
    analytics,
  };
}

export default function DashboardClient() {
  const { data, isLoading, isRefetching, error } = useAdminData(
    fetchDashboardData,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      enableBackgroundRefetch: true,
    },
  );

  console.log("Error on loading admin dashboard " + error);

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Error Loading Dashboard
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>

        {data && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Products"
                value={data.totalProducts}
                iconName="inventory"
                color="blue"
                change={
                  data.analytics?.changes.products
                    ? {
                        value: `${data.analytics.changes.products > 0 ? "+" : ""}${data.analytics.changes.products}%`,
                        type:
                          data.analytics.changes.products > 0
                            ? "increase"
                            : data.analytics.changes.products < 0
                              ? "decrease"
                              : "neutral",
                      }
                    : undefined
                }
              />

              <DashboardCard
                title="Total Orders"
                value={data.totalOrders}
                iconName="orders"
                color="green"
                change={
                  data.analytics?.changes.orders
                    ? {
                        value: `${data.analytics.changes.orders > 0 ? "+" : ""}${data.analytics.changes.orders}%`,
                        type:
                          data.analytics.changes.orders > 0
                            ? "increase"
                            : data.analytics.changes.orders < 0
                              ? "decrease"
                              : "neutral",
                      }
                    : undefined
                }
              />

              <DashboardCard
                title="Total Users"
                value={data.totalUsers}
                iconName="people"
                color="purple"
                change={
                  data.analytics?.changes.users
                    ? {
                        value: `${data.analytics.changes.users > 0 ? "+" : ""}${data.analytics.changes.users}%`,
                        type:
                          data.analytics.changes.users > 0
                            ? "increase"
                            : data.analytics.changes.users < 0
                              ? "decrease"
                              : "neutral",
                      }
                    : undefined
                }
              />

              <DashboardCard
                title="Total Sales"
                value={`₦${data.totalSales.toLocaleString()}`}
                iconName="analytics"
                color="yellow"
                change={
                  data.analytics?.changes.sales
                    ? {
                        value: `${data.analytics.changes.sales > 0 ? "+" : ""}${data.analytics.changes.sales}%`,
                        type:
                          data.analytics.changes.sales > 0
                            ? "increase"
                            : data.analytics.changes.sales < 0
                              ? "decrease"
                              : "neutral",
                      }
                    : undefined
                }
              />
            </div>

            {/* Sales Chart */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <SalesChart data={data.graphData || []} />
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Orders
              </h3>
              <div className="space-y-3">
                {data.orders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          #{order.id?.substring(0, 8) || "N/A"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₦
                        {typeof order.totalAmount === "string"
                          ? parseFloat(order.totalAmount).toLocaleString()
                          : (Number(order.totalAmount) || 0).toLocaleString()}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))}
                {data.orders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No recent orders</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <MdInventory className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Manage Products</h4>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove products
                </p>
              </button>

              <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <MdAdd className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">View Orders</h4>
                <p className="text-sm text-gray-600">Track and manage orders</p>
              </button>

              <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                  <MdPeople className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-600">
                  View and manage user accounts
                </p>
              </button>

              <button className="bg-white border border-gray-200 p-6 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                  <MdAnalytics className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-600">Detailed reports</p>
              </button>
            </div>
          </>
        )}
      </div>
    </LoadingStates>
  );
}

import React from "react";
import { getOrders } from "@/lib/jespo/queries/orders";
import { requireAdmin } from "@/lib/auth/serverAuth";
import OrdersTable from "@/components/layout/admin/OrdersTable";
import {
  MdShoppingCart,
  MdAttachMoney,
  MdTrendingUp,
  MdCheckCircle,
} from "react-icons/md";

export default async function AdminOrdersPage() {
  // Require admin authentication
  await requireAdmin();

  const orders = await getOrders();

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const amount =
      typeof order.totalAmount === "string"
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount) || 0;
    return sum + amount;
  }, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "processing",
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage customer orders and track fulfillment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {totalRevenue.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <MdAttachMoney className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <MdTrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completed Orders
              </p>
              <p className="text-2xl font-bold text-green-600">
                {completedOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={orders} />
    </div>
  );
}

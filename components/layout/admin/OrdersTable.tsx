"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderAttributes } from "@/models/order.model";
import {
  MdSearch,
  MdVisibility,
  MdEdit,
  MdFilterList,
  MdPerson,
  MdInventory2,
  MdAttachMoney,
} from "react-icons/md";
import AdminSelect from "./AdminSelect";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

interface OrdersTableProps {
  orders: OrderAttributes[];
}

export default function OrdersTable({
  orders,
}: OrdersTableProps): React.ReactElement {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    order: OrderAttributes | null;
    newStatus: string;
  }>({ isOpen: false, order: null, newStatus: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper functions for date filtering
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().includes(searchTerm) ||
      order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday(new Date(order.createdAt || ""))) ||
      (dateFilter === "week" && isThisWeek(new Date(order.createdAt || ""))) ||
      (dateFilter === "month" && isThisMonth(new Date(order.createdAt || "")));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatPrice = (price: number | undefined) => {
    if (!price) return "₦0";
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (
    order: OrderAttributes,
    newStatus: string,
  ) => {
    if (order.status === newStatus) return; // No change needed

    setIsUpdating(true);

    // Show loading toast
    const loadingToast = toast.loading(
      `Updating order status to ${newStatus}...`,
    );

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success(`Order status updated to ${newStatus}!`);

        // Force page refresh to show updated data
        window.location.reload();
      } else {
        const error = await response.json();
        toast.dismiss(loadingToast);
        toast.error(error.message || "Failed to update order status");
      }
    } catch (error: unknown) {
      console.error("Error updating order status:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdateConfirm = async () => {
    if (!updateModal.order) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${updateModal.order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updateModal.newStatus }),
      });

      if (response.ok) {
        toast.success(`Order status updated to ${updateModal.newStatus}!`);
        setUpdateModal({ isOpen: false, order: null, newStatus: "" });

        // Refresh the page to show updated data
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update order status");
      }
    } catch (error: unknown) {
      console.error("Error updating order status:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update order status";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdateCancel = () => {
    setUpdateModal({ isOpen: false, order: null, newStatus: "" });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <AdminSelect
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />

          {/* Date Filter */}
          <AdminSelect
            options={[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ]}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="All Time"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <MdInventory2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <MdPerson className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        User {order.userId}
                      </div>
                      <div className="text-sm text-gray-500">Customer</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.products
                      ? typeof order.products === "string"
                        ? JSON.parse(order.products).length
                        : order.products.length
                      : 0}{" "}
                    items
                  </div>
                  <div className="text-sm text-gray-500">Order items</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <MdAttachMoney className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(Number(order.totalAmount) || 0)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status || "pending"}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded border-0 focus:ring-2 focus:ring-primary-500 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(order.createdAt?.toString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/users/${order.userId}`}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                      title="View Details"
                    >
                      <MdVisibility className="w-4 h-4" />
                    </Link>
                    {/* <button
                      className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      title="Edit Status"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <MdInventory2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" || dateFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No orders have been placed yet."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredOrders.length}</span> of{" "}
                <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      <ConfirmModal
        isOpen={updateModal.isOpen}
        onClose={handleStatusUpdateCancel}
        onConfirm={handleStatusUpdateConfirm}
        title="Update Order Status"
        message={`Are you sure you want to update order #${updateModal.order?.id} status to "${updateModal.newStatus}"?`}
        confirmText="Update Status"
        cancelText="Cancel"
        type="info"
        isLoading={isUpdating}
      />
    </div>
  );
}

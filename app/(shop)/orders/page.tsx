"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import {
  MdGifBox,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
  MdVisibility,
} from "react-icons/md";
import { OrderAttributes } from "@/models/order.model";
import { CartProductTypeAttributes } from "@/lib/jespo/contracts";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: string;
  trackingNumber?: string;
}

export default function OrdersPage(): React.ReactElement {
  return (
    <ProtectedLayout>
      <OrdersPageContent />
    </ProtectedLayout>
  );
}

function OrdersPageContent(): React.ReactElement {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [orders, setOrders] = useState<OrderAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real orders from database
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${session?.user?.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <MdGifBox className="w-4 h-4" />;
      case "processing":
        return <MdGifBox className="w-4 h-4" />;
      case "shipped":
        return <MdLocalShipping className="w-4 h-4" />;
      case "delivered":
        return <MdCheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <MdCancel className="w-4 h-4" />;
      default:
        return <MdGifBox className="w-4 h-4" />;
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb />
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filter Orders
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 font-medium transition-colors ${
                selectedStatus === filter.value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdGifBox className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Orders Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {selectedStatus === "all"
              ? "You haven't placed any orders yet. Start shopping to see your orders here."
              : `No orders found with status: ${selectedStatus}`}
          </p>
          <a
            href="/products"
            className="bg-primary-600 text-white px-8 py-3 font-medium hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-600">
                        Placed on{" "}
                        {new Date(order.createdAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₦
                        {(typeof order.totalAmount === "string"
                          ? parseFloat(order.totalAmount)
                          : Number(order.totalAmount) || 0
                        ).toLocaleString()}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium ${getStatusColor(order.status || "pending")}`}
                      >
                        {getStatusIcon(order.status || "pending")}
                        {(order.status || "pending").charAt(0).toUpperCase() +
                          (order.status || "pending").slice(1)}
                      </div>
                    </div>

                    <button className="bg-primary-600 text-white px-4 py-2 font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                      <MdVisibility className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Order Items ({order.products?.length || 0})
                </h4>
                <div className="space-y-4">
                  {order.products?.map(
                    (item: CartProductTypeAttributes, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                          {item.selectedImage ? (
                            <img
                              src={item.selectedImage}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.name}
                          </h5>
                          <p className="text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Shipping Address:</strong>{" "}
                        {order.address
                          ? `${order.address.firstName} ${order.address.lastName}, ${order.address.address}, ${order.address.city}, ${order.address.state}`
                          : "No address provided"}
                      </p>
                      {order.paymentIntentId && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Payment ID:</strong> {order.paymentIntentId}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {order.status === "delivered" && (
                        <button className="bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 transition-colors">
                          Reorder
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button className="bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors">
                          Track Package
                        </button>
                      )}
                      {order.status === "pending" && (
                        <button className="bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Statistics */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {orders.length}
          </div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-gray-600">Delivered</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {
              orders.filter(
                (o) => o.status === "shipped" || o.status === "processing",
              ).length
            }
          </div>
          <div className="text-gray-600">In Transit</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">
            ₦
            {orders
              .reduce((sum, order) => {
                const amount =
                  typeof order.totalAmount === "string"
                    ? parseFloat(order.totalAmount)
                    : Number(order.totalAmount) || 0;
                return sum + amount;
              }, 0)
              .toLocaleString()}
          </div>
          <div className="text-gray-600">Total Spent</div>
        </div>
      </div>
    </div>
  );
}

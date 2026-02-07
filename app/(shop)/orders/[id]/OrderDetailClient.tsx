"use client";

import React from "react";
import { OrderAttributes } from "@/models/order.model";
import { CartProductTypeAttributes } from "@/lib/jespo/contracts";
import {
  MdCheckCircle,
  MdLocalShipping,
  MdPayment,
  MdLocationOn,
  MdShoppingBag,
} from "react-icons/md";
import Breadcrumb from "@/components/layout/common/Breadcrumb";

interface OrderDetailClientProps {
  order: OrderAttributes;
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  // Parse products and address from JSON strings
  const products = order.products
    ? typeof order.products === "string"
      ? JSON.parse(order.products)
      : order.products
    : [];
  const address = order.address
    ? typeof order.address === "string"
      ? JSON.parse(order.address)
      : order.address
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <MdCheckCircle className="w-5 h-5" />;
      case "shipped":
        return <MdLocalShipping className="w-5 h-5" />;
      case "processing":
        return <MdPayment className="w-5 h-5" />;
      case "pending":
        return <MdShoppingBag className="w-5 h-5" />;
      default:
        return <MdShoppingBag className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MdShoppingBag className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status || "pending")}`}
              >
                {getStatusIcon(order.status || "pending")}
                {order.status || "Pending"}
              </div>
              <span className="text-gray-600">
                {order.deliveryStatus || "Processing"}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {products.map(
                (product: CartProductTypeAttributes, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-2xl">📱</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ₦{(product.price * product.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdLocationOn className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="text-gray-700">
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Email:</span> {address.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {address.phone}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 sticky top-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₦{(order.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ₦{((order.amount || 0) * 0.05).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ₦
                    {(typeof order.totalAmount === "string"
                      ? parseFloat(order.totalAmount)
                      : Number(order.totalAmount) || Number(order.amount) || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Payment Method
                </h3>
                <p className="text-gray-600">Credit/Debit Card</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Order Date</h3>
                <p className="text-gray-600">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Celebration Emoji */}
      <div className="text-8xl mb-6">🎉</div>

      {/* Success Message */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Order Placed Successfully!
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Thank you for your purchase! Your order has been received and will be
        processed once payment is confirmed.
      </p>

      {/* Order Reference */}
      {reference && (
        <p className="text-lg text-gray-700 mb-4">
          <strong>Reference:</strong> {reference}
        </p>
      )}

      {/* Simple Status */}
      <p className="text-lg text-gray-600 mb-8">
        <strong>Status:</strong> Payment processing...
      </p>

      <p className="text-base text-gray-500 mb-12">
        You&#39;ll receive a confirmation email shortly
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/orders"
          className="bg-primary-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          View My Orders
        </Link>
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 py-3 px-8 rounded-lg font-medium transition-colors border border-gray-300 hover:border-gray-400"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

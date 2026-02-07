"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { AuthUser } from "@/lib/auth/serverAuth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  MdShoppingBag,
  MdLocationOn,
  MdPayment,
  MdCheckCircle,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import AuthModal from "@/components/auth/AuthModal";

// Declare PaystackPop for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

interface CheckoutClientProps {
  loggedInUser: AuthUser;
}

export default function CheckoutClient({ loggedInUser }: CheckoutClientProps) {
  const { cartProducts, cartTotalAmount, cartTotalQuantity, handleClearCart } =
    useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingPaystack, setIsLoadingPaystack] = useState(false);

  // Add a fallback redirect mechanism
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Check if we have a pending order and redirect to success page
      const pendingOrder = sessionStorage.getItem("pendingOrder");
      const tempOrderId = sessionStorage.getItem("tempOrderId");

      if (pendingOrder && tempOrderId) {
        // This means payment was successful but redirect didn't work
        const orderData = JSON.parse(pendingOrder);
        router.push(
          `/checkout/success?reference=${tempOrderId}&orderId=${tempOrderId}`,
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [router]);

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checkout
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!session || !loggedInUser) {
      setShowAuthModal(true);
      return;
    }

    // Validate form data
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Generate a temporary order ID for Paystack metadata
    const tempOrderId = `TEMP-${Date.now()}`;

    // Prepare order data for Paystack metadata
    const orderData = {
      userId: loggedInUser?.id || "guest",
      products: cartProducts,
      totalAmount: cartTotalAmount * 1.05, // Include tax
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
      paymentMethod: "paystack",
      status: "pending",
      paymentStatus: "pending",
    };

    // Store order data temporarily for after payment success
    sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));
    sessionStorage.setItem("tempOrderId", tempOrderId);

    // Directly open Paystack payment
    await handlePaystackPayment();
  };

  const handlePaymentSuccess = async (reference: any) => {
    console.log("Payment success callback triggered:", reference);
    setIsLoadingPaystack(false);

    try {
      // Show success toast immediately
      toast.success("Payment successful! Order placed successfully!");

      // Get the pending order data from session storage
      const pendingOrderData = sessionStorage.getItem("pendingOrder");

      if (!pendingOrderData) {
        console.error("No pending order data found in session storage");
        toast.error("Order data not found");
        return;
      }

      const orderData = JSON.parse(pendingOrderData);
      console.log("Creating order with data:", orderData);

      // Create the actual order after payment success
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          paymentReference: reference.reference,
          status: "pending", // Keep as pending until webhook confirms
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order created successfully:", result);

        // Clear session storage
        sessionStorage.removeItem("pendingOrder");
        sessionStorage.removeItem("tempOrderId");

        // Clear cart
        handleClearCart();

        // Redirect to success page immediately
        console.log(
          "Redirecting to success page:",
          `/checkout/success?reference=${reference.reference}&orderId=${result.orderId}`,
        );
        router.push(
          `/checkout/success?reference=${reference.reference}&orderId=${result.orderId}`,
        );
      } else {
        const error = await response.json();
        console.error("Failed to create order:", error);
        toast.error(error.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order after payment:", error);
      toast.error("Payment successful but failed to create order");
    }
  };

  const handlePaymentClose = () => {
    setIsLoadingPaystack(false);
    toast.error("Payment cancelled");
  };

  const handlePaystackPayment = async () => {
    setIsLoadingPaystack(true);

    try {
      // Check if Paystack script is loaded
      if (!window.PaystackPop) {
        // Load Paystack script
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.head.appendChild(script);

        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log("Paystack script loaded successfully");
            resolve(true);
          };
          script.onerror = (error) => {
            console.error("Failed to load Paystack script:", error);
            reject(error);
          };
        });
      }

      const tempOrderId = sessionStorage.getItem("tempOrderId");
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        toast.error(
          "Paystack public key not configured. Please check your environment variables.",
        );
        console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set");
        return;
      }

      if (!publicKey.startsWith("pk_")) {
        toast.error("Invalid Paystack public key format");
        console.error("Public key should start with 'pk_'");
        return;
      }

      console.log("Initializing Paystack with:", {
        key: publicKey,
        email: formData.email,
        amount: Math.round(cartTotalAmount * 1.05 * 100),
        ref: tempOrderId,
      });

      // Initialize Paystack popup
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: Math.round(cartTotalAmount * 1.05 * 100), // Convert to kobo
        currency: "NGN",
        ref: tempOrderId || `JESPO_${Date.now()}`,
        callback_url: `${window.location.origin}/checkout/success?reference=${tempOrderId}&orderId=${tempOrderId}`,
        metadata: {
          tempOrderId: tempOrderId,
          userId: loggedInUser?.id,
          customerEmail: formData.email,
        },
        callback: function (response: any) {
          console.log(
            "Paystack payment successful callback triggered:",
            response,
          );
          // Payment successful, handle it immediately
          handlePaymentSuccess(response);
        },
        onClose: function () {
          console.log("Paystack popup closed by user");
          handlePaymentClose();
        },
      });

      // Open Paystack popup
      handler.openIframe();
      setIsLoadingPaystack(false);
    } catch (error) {
      console.error("Error initializing Paystack payment:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsLoadingPaystack(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      <div className="flex items-center gap-3 mb-6">
        <MdShoppingBag className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Authentication Notice */}
      {(!session || !loggedInUser) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <MdPayment className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Authentication Required
              </h3>
              <p className="text-sm text-yellow-700">
                You need to sign in or create an account to complete your
                purchase. This helps us track your orders and provide better
                service.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <MdLocationOn className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MdLocationOn className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-lg focus:outline-none focus:ring-0 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky" style={{ top: "180px", zIndex: 20 }}>
            <div className="bg-white border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.selectedImg?.image ? (
                        <img
                          src={item.selectedImg.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-sm">📱</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium text-sm text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartTotalQuantity} items)
                  </span>
                  <span className="font-medium">
                    ₦{cartTotalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ₦{(cartTotalAmount * 0.05).toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>₦{(cartTotalAmount * 1.05).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing || isLoadingPaystack}
                className={`w-full py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                  !session || !loggedInUser
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                }`}
              >
                {isProcessing || isLoadingPaystack ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isLoadingPaystack ? "Loading Payment..." : "Processing..."}
                  </>
                ) : !session || !loggedInUser ? (
                  <>
                    <MdPayment className="w-4 h-4" />
                    Sign In to Place Order
                  </>
                ) : (
                  <>
                    <MdCheckCircle className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="w-full mt-3 text-primary-600 py-2 px-4 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Refresh the page to get updated session
          window.location.reload();
        }}
        redirectTo="/checkout"
      />
    </div>
  );
}

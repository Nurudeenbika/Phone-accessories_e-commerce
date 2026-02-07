"use client";

import { LoggedInUserParams } from "@/lib/jespo/contracts";
import { useCart } from "@/context/CartContext";
import { MdDelete, MdRemove, MdAdd, MdShoppingBag } from "react-icons/md";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import StickyBelowNavbar from "@/components/layout/common/StickyBelowNavbar";

export default function CartClient({ loggedInUser }: LoggedInUserParams) {
  const {
    cartProducts,
    cartTotalAmount,
    cartTotalQuantity,
    handleRemoveProductFromCart,
    handleCartQuantityIncrease,
    handleCartQuantityDecrease,
    handleClearCart,
  } = useCart();

  const router = useRouter();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-red-200 hover:border-red-300"
        >
          <MdDelete className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartProducts.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden">
                  {item.selectedImg?.image ? (
                    <img
                      src={item.selectedImg.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-2xl">📱</div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleCartQuantityDecrease(item)}
                    className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-200"
                  >
                    <MdRemove className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 min-w-[50px] text-center font-medium text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleCartQuantityIncrease(item)}
                    className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-200"
                  >
                    <MdAdd className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveProductFromCart(item)}
                  className="p-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-[200px] z-20">
            <div className="bg-white border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Items ({cartTotalQuantity})
                  </span>
                  <span className="font-semibold">
                    ₦{cartTotalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-b border-gray-100 py-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>₦{cartTotalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-primary-600 text-white py-3 px-4 font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MdShoppingBag className="w-4 h-4" />
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full mt-3 text-primary-600 py-2 px-4 font-medium hover:bg-primary-50 transition-colors border border-primary-600 text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

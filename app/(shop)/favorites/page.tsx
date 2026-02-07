"use client";

import React from "react";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdShoppingCart,
  MdDelete,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { useFavorites } from "@/context/FavoritesContext";
import { ProductAttributes } from "@/models/product.model";
import { useCart } from "@/context/CartContext";
import { CartProductType } from "@/lib/jespo/types";


export default function FavoritesPage(): React.ReactElement {
  const { favoriteProducts, removeFromFavorites, clearFavorites } =
    useFavorites();
  const { handleAddProductToCart } = useCart();

  const addToCart = (product: ProductAttributes) => {
    const cartProduct: CartProductType = {
      id: product.id || "",
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      selectedImg: {
        color: "default",
        colorCode: "#000000",
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : "/placeholder-product.jpg",
      },
      quantity: 1,
      price: product.price || 0,
    };

    handleAddProductToCart(cartProduct);
    toast.success("Added to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {favoriteProducts.length}{" "}
            {favoriteProducts.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <MdDelete className="w-5 h-5" />
            Clear All
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdFavoriteBorder className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your wishlist by adding products you love. Click the
            heart icon on any product to save it for later.
          </p>
          <a
            href="/products"
            className="bg-primary-600 text-white px-8 py-3 font-medium hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-6">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center"><div class="text-6xl">📱</div></div>';
                    }}
                  />
                ) : (
                  <div className="text-6xl">📱</div>
                )}

                {/* Remove from Favorites Button */}
                <button
                  onClick={() => removeFromFavorites(product.id!)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <MdFavorite className="w-5 h-5 text-red-500" />
                </button>

                {/* Discount Badge */}
                {product.list && product.list > (product.price || 0) && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                    -
                    {Math.round(
                      ((product.list - (product.price || 0)) / product.list) *
                        100,
                    )}
                    %
                  </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute bottom-4 left-4 bg-gray-500 text-white px-3 py-1 text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₦{(product.price || 0).toLocaleString()}
                  </span>
                  {product.list && product.list > (product.price || 0) && (
                    <span className="text-sm text-gray-500 line-through">
                      ₦{product.list.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-primary-600 text-white py-2 px-4 font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <MdShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromFavorites(product.id!)}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 font-medium hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <MdDelete className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {favoriteProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mock recommended products */}
            {[
              {
                id: 5,
                name: "Wireless Mouse",
                price: 15000,
                brand: "TechGear",
                image: "🖱️",
              },
              {
                id: 6,
                name: "Phone Stand",
                price: 8000,
                brand: "StandPro",
                image: "📱",
              },
              {
                id: 7,
                name: "Laptop Sleeve",
                price: 12000,
                brand: "ProtectCase",
                image: "💻",
              },
              {
                id: 8,
                name: "Tablet Stylus",
                price: 18000,
                brand: "DrawTech",
                image: "✏️",
              },
            ].map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 p-4 group"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center mb-4">
                  <div className="text-4xl">{product.image}</div>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdFavoriteBorder className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CartProductType } from "@/lib/jespo/types";
import {
  MdShoppingCart,
  MdFavorite,
  MdFavoriteBorder,
  MdStar,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import {ProductCardProps} from "@/lib/jespo/contracts";


const ProductCard = memo(function ProductCard({
  product,
  index = 0,
}: ProductCardProps) {
  const router = useRouter();
  const { handleAddProductToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const isProductFavorite = isFavorite(product.id!);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const cartProduct: CartProductType = {
        id: product.id!,
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
    },
    [product, handleAddProductToCart],
  );

  const toggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isProductFavorite) {
        removeFromFavorites(product.id!);
      } else {
        addToFavorites(product);
      }
    },
    [isProductFavorite, product, addToFavorites, removeFromFavorites],
  );

  const discountPercentage =
    product.list && product.price
      ? Math.round(((product.list - product.price) / product.list) * 100)
      : 0;

  const rating = 4.5; // Mock rating
  const reviewCount = 42; // Mock review count (fixed to avoid hydration mismatch)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/product/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group relative"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="w-full h-full flex items-center justify-center"><div class="text-6xl">📱</div></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">📱</div>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
          >
            -{discountPercentage}%
          </motion.div>
        )}

        {/* Favorite Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          {isProductFavorite ? (
            <MdFavorite className="w-5 h-5 text-red-500" />
          ) : (
            <MdFavoriteBorder className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

        {/* Add to Cart Button */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: isHovered ? 0 : 50,
            opacity: isHovered ? 1 : 0,
          }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="absolute bottom-3 left-3 right-3 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <MdShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <MdStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">
            ₦{product.price?.toLocaleString() || "0"}
          </span>
          {product.list && product.list > (product.price || 0) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="text-sm text-gray-500 line-through"
            >
              ₦{product.list.toLocaleString()}
            </motion.span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;

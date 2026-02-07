"use client";

import { ProductAttributes } from "@/models/product.model";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartProductType } from "@/lib/jespo/types";
import { MdShoppingCart } from "react-icons/md";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: ProductAttributes;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { handleAddProductToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart

    const cartProduct: CartProductType = {
      id: product.id!,
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      selectedImg: {
        color: "default",
        colorCode: "#000000",
        image: "/placeholder-product.jpg",
      },
      quantity: 1,
      price: product.price || 0,
    };

    handleAddProductToCart(cartProduct);
    toast.success("Added to cart!");
  };

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-4xl">📱</div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-sm text-gray-600">{product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₦{product.price?.toLocaleString() || "0"}
          </span>
          {product.list && product.list > (product.price || 0) && (
            <span className="text-sm text-gray-500 line-through">
              ₦{product.list.toLocaleString()}
            </span>
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

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <MdShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

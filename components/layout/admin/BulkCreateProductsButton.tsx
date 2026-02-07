"use client";

import React, { useState } from "react";
import { MdAdd, MdSmartphone, MdOutlineKeyboard } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

interface BulkCreateProductsButtonProps {
  onProductsCreated?: () => void;
}

export default function BulkCreateProductsButton({
  onProductsCreated,
}: BulkCreateProductsButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productCount, setProductCount] = useState(20);

  const handleBulkCreate = async () => {
    setIsCreating(true);

    try {
      console.log("Starting bulk product creation...");
      const response = await fetch("/api/admin/generate-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: productCount }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          `Failed to create products: ${errorData.error || "Unknown error"}`,
        );
      }

      const result = await response.json();
      console.log("Success result:", result);
      toast.success(`Successfully created ${result.generated} products!`);

      // Refresh the page or call callback
      if (onProductsCreated) {
        onProductsCreated();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating products:", error);
      toast.error(
        `Failed to create products: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsCreating(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={isCreating}
        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <MdAdd className="w-5 h-5" />
        {isCreating ? "Creating..." : "Bulk Create"}
      </button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleBulkCreate}
        title="Bulk Create Products"
        message={`This will create ${productCount} new products with realistic names for Phones and Phone Accessories categories. All products will use the same image.`}
        confirmText="Create Products"
        cancelText="Cancel"
        type="info"
        isLoading={isCreating}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of products to create:
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={productCount}
            onChange={(e) => setProductCount(parseInt(e.target.value) || 20)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCreating}
          />
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <MdSmartphone className="w-4 h-4" />
              <span>Phones: {Math.floor(productCount * 0.6)} products</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineKeyboard className="w-4 h-4" />
              <span>
                Phone Accessories: {Math.floor(productCount * 0.4)} products
              </span>
            </div>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
}

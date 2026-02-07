"use client";

import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

interface DeleteAllProductsButtonProps {
  onProductsDeleted?: () => void;
}

export default function DeleteAllProductsButton({
  onProductsDeleted,
}: DeleteAllProductsButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteAll = async () => {
    setIsDeleting(true);

    try {
      console.log("Starting bulk deletion...");
      const response = await fetch("/api/admin/delete-all-products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          `Failed to delete products: ${errorData.error || "Unknown error"}`,
        );
      }

      const result = await response.json();
      console.log("Success result:", result);
      toast.success(`Successfully deleted ${result.deletedCount} products!`);

      // Refresh the page or call callback
      if (onProductsDeleted) {
        onProductsDeleted();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting products:", error);
      toast.error(
        `Failed to delete products: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <MdDelete className="w-5 h-5" />
        {isDeleting ? "Deleting..." : "Delete All"}
      </button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Products"
        message="Are you sure you want to delete all products? This will permanently remove all product data from the database and cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}

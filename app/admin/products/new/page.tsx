"use client";

import React, { useState } from "react";
import ProductForm from "@/components/layout/admin/ProductForm";
import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/models/product.model";
import toast from "react-hot-toast";

export default function NewProductPage() {
  return <NewProductPageContent />;
}

function NewProductPageContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<ProductAttributes>) => {
    console.log("New product page handleSubmit called with:", data);
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">
          Create a new product for your store
        </p>
      </div>

      {/* Product Form */}
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

"use client";

import React, { useEffect, useState, use } from "react";
import ProductForm from "@/components/layout/admin/ProductForm";
import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/models/product.model";
import toast from "react-hot-toast";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/admin/products/${resolvedParams.id}`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch product");
        }

        setProduct(result.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleSubmit = async (data: Partial<ProductAttributes>) => {
    console.log("Edit product page handleSubmit called with:", data);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Loading product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      {/* Product Form */}
      <ProductForm
        product={product || undefined}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}

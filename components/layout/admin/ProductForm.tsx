"use client";

import React, { useState } from "react";
import { ProductAttributes } from "@/models/product.model";
import { productCategories } from "@/lib/utils/data/productcategories";
import { MdUpload, MdDelete, MdAdd } from "react-icons/md";
import AdminSelect from "./AdminSelect";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

interface ProductFormProps {
  product?: ProductAttributes;
  onSubmit: (data: Partial<ProductAttributes>) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps): React.ReactElement {
  const [formData, setFormData] = useState<Partial<ProductAttributes>>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || undefined,
    list: product?.list || undefined,
    brand: product?.brand || "",
    category: product?.category || "",
    inStock: product?.inStock !== false,
    ...product,
  });

  const [productImages, setProductImages] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesChange = (
    images: Array<{ file: File; preview: string }>,
  ) => {
    setProductImages(images);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("Product images:", productImages);

    if (validateForm()) {
      console.log("Form validation passed, calling onSubmit");
      try {
        // Upload images first
        let uploadedImageUrls: string[] = [];

        if (productImages.length > 0) {
          setIsUploadingImages(true);
          console.log("Uploading images...", productImages);
          const uploadPromises = productImages.map(async (imageFile, index) => {
            console.log(
              `Uploading image ${index + 1}:`,
              imageFile.file.name,
              imageFile.file.size,
              imageFile.file.type,
            );
            const formData = new FormData();
            formData.append("file", imageFile.file);

            console.log("FormData created, sending request...");
            const response = await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });

            console.log("Upload response status:", response.status);
            console.log(
              "Upload response headers:",
              Object.fromEntries(response.headers.entries()),
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error("Upload failed:", errorText);
              throw new Error(
                `Failed to upload image: ${response.status} - ${errorText}`,
              );
            }

            const result = await response.json();
            console.log("Upload successful:", result);
            return result.url;
          });

          uploadedImageUrls = await Promise.all(uploadPromises);
          console.log("Images uploaded successfully:", uploadedImageUrls);
          setIsUploadingImages(false);
        }

        // Combine existing images with newly uploaded ones
        const allImages = [...existingImages, ...uploadedImageUrls];

        // Include uploaded image URLs in the form data
        const submitData = {
          ...formData,
          images: allImages,
        };

        await onSubmit(submitData);
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsUploadingImages(false);
      }
    } else {
      console.log("Form validation failed, errors:", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <RichTextEditor
                  value={formData.description || ""}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter product description..."
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Price (₦)
                  </label>
                  <input
                    type="number"
                    value={formData.list || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "list",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none ${
                      errors.list ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.list && (
                    <p className="mt-1 text-sm text-red-600">{errors.list}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <AdminSelect
                  options={[
                    { value: "", label: "Select a category" },
                    ...productCategories.map((category) => ({
                      value: category.title,
                      label: category.title,
                    })),
                  ]}
                  value={formData.category || ""}
                  onChange={(value) => handleInputChange("category", value)}
                  placeholder="Select a category"
                  className={errors.category ? "border-red-300" : ""}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images
            </h3>

            <ImageUploader
              images={productImages}
              existingImages={existingImages}
              onImagesChange={handleImagesChange}
              onExistingImagesChange={setExistingImages}
              maxImages={5}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) =>
                    handleInputChange("inStock", e.target.checked)
                  }
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                  Product is in stock
                </label>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  Products in stock are available for purchase by customers.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || isUploadingImages}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading || isUploadingImages ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isUploadingImages
                  ? "Uploading Images..."
                  : isLoading
                    ? "Saving..."
                    : product
                      ? "Update Product"
                      : "Create Product"}
              </button>

              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

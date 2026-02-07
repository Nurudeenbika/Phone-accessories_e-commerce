"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/models/product.model";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdMoreVert,
  MdImage,
  MdInventory,
  MdSearch,
} from "react-icons/md";
import AdminSelect from "./AdminSelect";
import ConfirmModal from "./ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsTableProps {
  products: ProductAttributes[];
  pagination?: PaginationData | null;
  onPageChange?: (page: number) => void;
}

export default function ProductsTable({
  products,
  pagination,
  onPageChange,
}: ProductsTableProps): React.ReactElement {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: ProductAttributes | null;
  }>({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Note: For server-side pagination, filtering and pagination are handled by the API
  // These local filters are kept for UI state but actual filtering should trigger new API calls

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  );

  const formatPrice = (price: number | undefined) => {
    if (!price) return "₦0";
    return `₦${price.toLocaleString()}`;
  };

  const getStockStatus = (inStock: boolean | undefined) => {
    if (inStock === false)
      return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
  };

  const handleDeleteClick = (product: ProductAttributes) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/products/${deleteModal.product.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      setDeleteModal({ isOpen: false, product: null });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, product: null });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <AdminSelect
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((category) => ({
                value: category || "",
                label: category || "",
              })),
            ]}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="All Categories"
          />

          {/* Status Filter */}
          <AdminSelect
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "outofstock", label: "Out of Stock" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.inStock);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.images && product.images.length > 0 ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.images[0]}
                            alt={product.name}
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center ${product.images && product.images.length > 0 ? "hidden" : ""}`}
                        >
                          <MdImage className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div
                          className="text-sm text-gray-500 max-w-xs line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html:
                              (product.description || "").substring(0, 100) +
                              (product.description &&
                              product.description.length > 100
                                ? "..."
                                : ""),
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MdInventory className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {product.category || "Uncategorized"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.brand || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                      >
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                        title="Edit"
                      >
                        <MdEdit className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="View"
                      >
                        <MdVisibility className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <MdSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating a new product."}
          </p>
        </div>
      )}

      {/* Server-side Pagination */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalCount,
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalCount}</span>{" "}
              results
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

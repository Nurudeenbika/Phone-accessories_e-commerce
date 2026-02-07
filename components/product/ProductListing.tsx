"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import CustomSelect from "@/components/ui/CustomSelect";
import Pagination from "@/components/ui/Pagination";
import { ProductAttributes } from "@/models/product.model";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import StickyBelowNavbar from "@/components/layout/common/StickyBelowNavbar";
import { productCategories } from "@/lib/utils/data/productcategories";
import { useRouter, useSearchParams } from "next/navigation";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import Link from "next/link";
import queryString from "query-string";
import type { ProductSearchFilters } from "@/models/product.model";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductListingProps {
  products: ProductAttributes[];
  title?: string;
  isLoading?: boolean;
  pagination?: PaginationData | null;
  onPageChange?: (page: number) => void;
}

interface FilterState {
  sortBy: string;
  priceRange: string;
  color: string;
  inStock: boolean;
}

export default function ProductListing({
  products,
  title = "All Products",
  isLoading = false,
  pagination,
  onPageChange,
}: ProductListingProps) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "featured",
    priceRange: "all",
    color: "all",
    inStock: false,
  });
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategorySlug = searchParams.get("category");

  const activeCategory =
    productCategories.find((cat) => cat.label === activeCategorySlug)?.label ??
    "All";

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];

    switch (filters.sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

      case "price-high":
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case "rating":
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );

      case "best-selling":
        return sorted.sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0));

      default:
        return sorted;
    }
  }, [products, filters.sortBy]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "best-selling", label: "Best Selling" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "rating", label: "Highest Rated" },
  ];

  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "0-50000", label: "Under ₦50,000" },
    { value: "50000-200000", label: "₦50,000 - ₦200,000" },
    { value: "200000-500000", label: "₦200,000 - ₦500,000" },
    { value: "500000-1000000", label: "₦500,000 - ₦1,000,000" },
    { value: "1000000+", label: "Above ₦1,000,000" },
  ];

  // Handle filter changes - these will trigger new API calls from the parent
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Note: Filter changes should trigger new API calls from the parent component
    // For now, we'll keep the filters for UI state, but actual filtering happens server-side

    // Map frontend sort options to backend
    let orderBy: ProductSearchFilters["orderBy"] | undefined;
    let orderDir: ProductSearchFilters["orderDir"] | undefined;

    switch (key) {
      case "sortBy":
        switch (value) {
          case "price-low":
            orderBy = "price";
            orderDir = "ASC";
            break;
          case "price-high":
            orderBy = "price";
            orderDir = "DESC";
            break;
          case "name":
            orderBy = "name";
            orderDir = "ASC";
            break;
          case "newest":
            orderBy = "createdAt"; // you might need to add createdAt to orderBy allowed fields in backend
            orderDir = "DESC";
            break;
          case "best-selling":
            orderBy = "totalSold"; // same as above
            orderDir = "DESC";
            break;
          case "rating":
            orderBy = "rating"; // same as above
            orderDir = "DESC";
            break;
        }
        break;
    }

    const currentQuery = queryString.parse(searchParams.toString());

    const updatedQuery = {
      ...currentQuery,
      [key]: value === "all" ? undefined : value,
      page: 1, // reset pagination
      orderBy,
      orderDir,
    };

    const url = queryString.stringifyUrl(
      { url: "/products", query: updatedQuery },
      { skipNull: true },
    );

    router.push(url);
  };

  const handlePageChange = (page: number) => {
    if (!onPageChange) return;

    const currentQuery = queryString.parse(searchParams.toString());
    const updatedQuery = { ...currentQuery, page }; // update page

    const url = queryString.stringifyUrl(
      { url: "/products", query: updatedQuery },
      { skipNull: true },
    );

    router.push(url); // update URL
    onPageChange(page); // notify parent to fetch new data
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header with Sort */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <CustomSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) =>
              !isLoading && handleFilterChange("sortBy", value)
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Sticky below navbar */}
        <div className="lg:col-span-1">
          <StickyBelowNavbar className="w-full" additionalSpacing={20}>
            {/* Categories */}
            <div className="bg-white border border-gray-200 p-4 mb-4">
              <div
                className={`flex items-center justify-between mb-4 ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                onClick={() =>
                  !isLoading && setIsCategoriesExpanded(!isCategoriesExpanded)
                }
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories
                </h3>
                <div className="transition-transform duration-300 ease-in-out">
                  {isCategoriesExpanded ? (
                    <MdExpandLess className="w-5 h-5 text-gray-600" />
                  ) : (
                    <MdExpandMore className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isCategoriesExpanded ? "auto" : 0,
                  opacity: isCategoriesExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  {/* All Products Option */}
                  <Link
                    href="/products"
                    className={`block transition-all duration-200 py-2 px-3 ${
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : activeCategory === "All"
                          ? "bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-700"
                          : "text-gray-700 hover:text-primary-700 hover:bg-gray-50"
                    }`}
                    onClick={(e) => isLoading && e.preventDefault()}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🛍️</span>
                      All Products
                    </div>
                  </Link>

                  {productCategories.map((category) => {
                    const isActive = activeCategory === category.label;

                    return (
                      <Link
                        key={category.label}
                        href={{
                          pathname: "/products",
                          query: { category: category.label },
                        }}
                        className={`block transition-all duration-200 py-2 px-3 ${
                          isLoading
                            ? "cursor-not-allowed opacity-50"
                            : isActive
                              ? "bg-primary-100 text-primary-800 font-semibold border-l-4 border-primary-700"
                              : "text-gray-700 hover:text-primary-700 hover:bg-gray-50"
                        }`}
                        onClick={(e) => isLoading && e.preventDefault()}
                      >
                        <div className="flex items-center gap-2">
                          <category.Icon size={16} />
                          {category.title}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Price Range */}
            <div className="bg-white border border-gray-200 p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price range
              </h3>
              <div className="w-full">
                <CustomSelect
                  options={priceRangeOptions}
                  value={filters.priceRange}
                  onChange={(value) =>
                    !isLoading && handleFilterChange("priceRange", value)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* In Stock Only */}
            <div className="bg-white border border-gray-200 p-4">
              <label
                className={`flex items-center ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    !isLoading &&
                    handleFilterChange("inStock", e.target.checked)
                  }
                  disabled={isLoading}
                  className="border-gray-300 text-primary-600 focus:ring-0"
                />
                <span className="ml-2 text-sm text-gray-700">
                  In Stock Only
                </span>
              </label>
            </div>
          </StickyBelowNavbar>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Server-side Pagination */}
              {pagination && pagination.totalPages > 1 && onPageChange && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

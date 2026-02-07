"use client";

import React, { useState, useEffect } from "react";
import ProductsTable from "@/components/layout/admin/ProductsTable";
import DeleteAllProductsButton from "@/components/layout/admin/DeleteAllProductsButton";
import BulkCreateProductsButton from "@/components/layout/admin/BulkCreateProductsButton";
import Link from "next/link";
import { MdAdd, MdSearch, MdFilterList, MdInventory } from "react-icons/md";
import { AdminSkeleton } from "@/components/ui/skeleton";
import { ProductAttributes } from "@/models/product.model";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminProductsPage() {
  return <AdminProductsPageContent />;
}

function AdminProductsPageContent() {
  const [products, setProducts] = useState<ProductAttributes[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    categories: 0,
  });

  // Fetch products and stats
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch products with pagination
        const productsResponse = await fetch(
          "/api/admin/products?page=1&limit=10",
        );
        const productsResult = await productsResponse.json();

        if (productsResponse.ok) {
          setProducts(productsResult.products || []);
          setPagination(productsResult.pagination || null);
        }

        // Fetch stats (get all products for stats)
        const statsResponse = await fetch("/api/admin/products?stats=true");
        const statsResult = await statsResponse.json();

        if (statsResponse.ok) {
          const productStats = statsResult.stats;

          setStats({
            total: productStats.totalProducts,
            active: productStats.activeProducts,
            outOfStock: productStats.outOfStock,
            categories: productStats.categories,
          });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <AdminSkeleton variant="card" count={4} />
        <AdminSkeleton variant="table" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <BulkCreateProductsButton />
          <DeleteAllProductsButton />
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MdAdd className="w-5 h-5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdInventory className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Products
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <MdFilterList className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <MdFilterList className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.categories}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <MdFilterList className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable
        products={products}
        pagination={pagination}
        onPageChange={(page) => {
          // Handle page change - fetch new data
          const fetchPage = async () => {
            setIsLoading(true);
            try {
              const response = await fetch(
                `/api/admin/products?page=${page}&limit=10`,
              );
              const result = await response.json();
              if (response.ok) {
                setProducts(result.products || []);
                setPagination(result.pagination || null);
              }
            } catch (error) {
              console.error("Error fetching page:", error);
            } finally {
              setIsLoading(false);
            }
          };


          fetchPage();
        }}
      />
    </div>
  );
}

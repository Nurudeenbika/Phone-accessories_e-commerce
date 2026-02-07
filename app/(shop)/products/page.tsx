"use client";

import React, { useState, useEffect } from "react";
import ProductListing from "@/components/product/ProductListing";
import { ProductAttributes } from "@/models/product.model";
//import { CategoryMap } from "@/lib/utils/mappers/category.map";

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string;
    search?: string;
    category?: string;
    page?: string;
    priceRange?: string;
    instock?: string;
  }>;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, setProducts] = useState<ProductAttributes[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentParams, setCurrentParams] = useState<{
    sort?: string;
    search?: string;
    category?: string;
    page?: string;
    instock?: string;
  }>({});

  // Initialize search params and fetch products
  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        const params = await searchParams;
        setCurrentParams(params);

        // Fetch products immediately
        setIsLoading(true);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.sort) queryParams.set("orderBy", "name");
        if (params.search) queryParams.set("search", params.search);
        if (params.category) queryParams.set("category", params.category);
        if (params.priceRange) queryParams.set("priceRange", params.priceRange);
        if (params.page) queryParams.set("page", params.page);

        const baseUrl =
          typeof window === "undefined"
            ? process.env.API_BASE_URL
            : process.env.NEXT_PUBLIC_BASE_URL;

        const response = await fetch(
          `/api/products?${queryParams.toString()}`,
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (response.ok) {
          setProducts(result.products || []);
          setPagination(result.pagination || null);
        } else {
          setProducts([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndFetch();
  }, [searchParams]);

  // Fetch products when params change (for pagination)
  useEffect(() => {
    //if (Object.keys(currentParams).length === 0) return;

    const fetchProducts = async () => {
      setIsLoading(true);

      const params = await searchParams;
      setCurrentParams(params);

      // Build query parameters
      const query = new URLSearchParams();

      if (params.search) query.set("search", params.search);
      if (params.category) query.set("category", params.category);
      if (params.priceRange) query.set("priceRange", params.priceRange);
      if (params.instock) query.set("instock", params.instock);
      if (params.page) query.set("page", params.page);
      if (params.sort) query.set("orderBy", "name");

      const baseUrl =
        typeof window === "undefined"
          ? process.env.API_BASE_URL
          : process.env.NEXT_PUBLIC_BASE_URL;

      try {
        const response = await fetch(`/api/products?${query.toString()}`, {
          cache: "no-store", // Ensure fresh data
        });

        const result = await response.json();

        if (response.ok) {
          setProducts(result.products || []);
          setPagination(result.pagination || null);
        } else {
          setProducts([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const title = currentParams.search
    ? `Search results for "${currentParams.search}"`
    : currentParams.category
      ? `${currentParams.category} Products`
      : "All Products";

  return (
    <ProductListing
      products={products}
      title={title}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={(page) => {
        setCurrentParams((prev) => ({ ...prev, page: page.toString() }));
      }}
    />
  );
}

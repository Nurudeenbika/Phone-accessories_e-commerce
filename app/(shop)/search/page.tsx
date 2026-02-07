import React from "react";
import ProductListing from "@/components/product/ProductListing";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  let products = [];
  if (q) {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.API_BASE_URL
        : process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(
      `/api/products?search=${encodeURIComponent(q)}`,
      {
        cache: "no-store", // Ensure fresh data
      },
    );

    const result = await response.json();
    products = response.ok ? result.products : [];
  }

  const title = q ? `Search results for "${q}"` : "Search Products";

  return <ProductListing products={products} title={title} />;
}

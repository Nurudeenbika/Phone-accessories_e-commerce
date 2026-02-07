import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://jespogadgets.com"
      : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store", // Ensure fresh data
  });

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();
  const product = result.product;

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

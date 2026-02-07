import React from "react";
import ProductListing from "@/components/product/ProductListing";
import { notFound } from "next/navigation";
import { CategoryMap } from "@/lib/utils/mappers/category.map";
import { Product } from "@/models/product.model";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  const label = CategoryMap[id] ?? id;
  console.log(`id passed to category page: ${id} and label ${label}`);

  const products = await Product.search({ category: label });
  console.log(`products passed to category page: ${products.length}`);

  if (products.length === 0) {
    notFound();
  }

  const title = `${label} Products`;

  return <ProductListing products={products} title={title} />;
}

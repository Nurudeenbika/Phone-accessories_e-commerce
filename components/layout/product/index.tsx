"use client";

import { ProductTileParams } from "@/lib/jespo/contracts";
import React from "react";
import { ProductCard } from "@/components/layout/product/productcard";

export default function ProductTile({
  products,
}: ProductTileParams): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}

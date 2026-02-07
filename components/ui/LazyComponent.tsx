"use client";

import { Suspense, lazy, ComponentType } from "react";
import { LoadingSpinner } from "./skeleton";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyComponent({ children, fallback }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner size="md" />}>
      {children}
    </Suspense>
  );
}

// Lazy load heavy components
export const LazyProductCard = lazy(
  () => import("@/components/product/ProductCard"),
);
export const LazyAdminTable = lazy(
  () => import("@/components/layout/admin/ProductsTable"),
);
export const LazyRichTextEditor = lazy(
  () => import("@/components/layout/admin/RichTextEditor"),
);

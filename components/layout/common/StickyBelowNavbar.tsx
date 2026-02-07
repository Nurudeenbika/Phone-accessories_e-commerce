"use client";

import React from "react";
import { NAVBAR_HEIGHT } from "@/lib/utils/layout";

interface StickyBelowNavbarProps {
  children: React.ReactNode;
  className?: string;
  additionalSpacing?: number;
  backgroundColor?: string;
  zIndex?: number;
}

/**
 * Component that sticks content below the navbar with proper spacing
 */
export default function StickyBelowNavbar({
  children,
  className = "",
  additionalSpacing = 50,
  backgroundColor = "bg-white",
  zIndex = 20,
}: StickyBelowNavbarProps) {
  const topOffset = NAVBAR_HEIGHT.total + additionalSpacing;

  return (
    <div
      className={`sticky ${backgroundColor} border-b border-gray-200 ${className}`}
      style={{
        top: `${topOffset}px`,
        zIndex: zIndex,
      }}
    >
      {children}
    </div>
  );
}

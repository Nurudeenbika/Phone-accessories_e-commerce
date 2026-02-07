"use client";

import React from "react";
import { MdRefresh } from "react-icons/md";

interface LoadingStatesProps {
  isLoading: boolean;
  isRefetching?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showRefetchIndicator?: boolean;
}

export function LoadingStates({
  isLoading,
  isRefetching = false,
  children,
  fallback,
  showRefetchIndicator = true,
}: LoadingStatesProps) {
  // Show full loading state only on initial load
  if (isLoading && !isRefetching) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 rounded-lg"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 rounded-lg"
            >
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background refetch indicator */}
      {isRefetching && showRefetchIndicator && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
            <MdRefresh className="w-4 h-4 text-primary-600 animate-spin" />
            <span className="text-sm text-gray-600">Updating...</span>
          </div>
        </div>
      )}

      {/* Main content */}
      {children}
    </div>
  );
}

// Skeleton components for different sections
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="border-b border-gray-100 p-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
}


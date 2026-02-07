"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { ProductAttributes } from "@/models/product.model";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function BestSelling() {
  const [bestSellingProducts, setBestSellingProducts] = useState<
    ProductAttributes[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/api/products?orderBy=price&orderDir=DESC&limit=8",
        );
        const result = await response.json();

        if (response.ok) {
          // Simulate best selling by taking products with higher prices (as they might be more popular)
          setBestSellingProducts(result.products);
        } else {
          console.error("Failed to fetch products:", result.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Best Selling
          </h2>
          <p className="text-gray-600">Our most popular products this month</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <MdChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <MdChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Link
            href="/products?sort=popular"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
            </div>
          ))}
        </div>
      ) : bestSellingProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Best Selling Products</h3>
          <p className="text-gray-500 mb-4">There are no best selling products at the moment.</p>
          <Link
            href="/products?sort=popular"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {bestSellingProducts.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

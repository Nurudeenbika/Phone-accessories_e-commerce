"use client";

import React from "react";
import Banner from "@/components/layout/main/banner";
import SearchBar from "@/components/layout/common/SearchBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSelling from "@/components/home/BestSelling";
import NewProducts from "@/components/home/NewProducts";

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Banner />
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <div className="w-full max-w-2xl px-4">
          <SearchBar />
        </div>
      </div>

      {/* Featured Categories */}
      <div className="flex justify-center mb-16">
        <div className="w-full max-w-7xl px-4">
          <FeaturedCategories />
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <FeaturedProducts />
      </div>

      {/* Best Selling */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <BestSelling />
      </div>

      {/* New Products */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <NewProducts />
      </div>
    </div>
  );
}

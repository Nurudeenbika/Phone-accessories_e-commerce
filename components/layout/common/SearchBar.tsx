"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdSearch } from "react-icons/md";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
      const initialQuery = searchParams.get("searchQuery") || "";
      setSearchQuery(initialQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products, brands, or categories..."
          className="w-full px-5 py-3 pl-12 pr-20 border border-gray-200 rounded-full focus:ring-0 focus:border-primary-700 focus:outline-none text-sm bg-gray-50 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
        />
        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-700 text-white px-6 py-2 rounded-full hover:bg-primary-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}

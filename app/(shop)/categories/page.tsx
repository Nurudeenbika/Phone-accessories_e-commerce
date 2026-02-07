"use client";

import React from "react";
import Link from "next/link";
import { productCategories } from "@/lib/utils/data/productcategories";
import { motion } from "framer-motion";


export default function CategoriesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          All Categories
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our complete range of product categories
        </p>
      </div>

      <div className="space-y-4">
        {productCategories.map((category, index) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/category/${category.label}`}>
              <motion.div
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <category.Icon className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600">
                      Browse our collection of {category.title.toLowerCase()}{" "}
                      products
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-primary-600 transition-colors">
                  <svg
                    className="w-6 h-6"
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
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

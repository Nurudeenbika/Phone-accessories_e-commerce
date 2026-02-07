"use client";

import React from "react";
import Link from "next/link";
import { productCategories } from "@/lib/utils/data/productcategories";
import { motion } from "framer-motion";

export default function FeaturedCategories() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Featured Categories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of premium electronics and gadgets
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {productCategories.map((category, index) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            <Link href={`/category/${category.label}`}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group w-full max-w-[200px] mx-auto"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <category.Icon className="w-8 h-8 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.title}
                </h3>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

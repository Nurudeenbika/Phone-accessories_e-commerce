"use client";

import { motion } from "framer-motion";

interface AdminSkeletonProps {
  variant?: "table" | "card" | "form";
  count?: number;
}

export default function AdminSkeleton({
  variant = "card",
  count = 1,
}: AdminSkeletonProps) {
  if (variant === "table") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <motion.div
              className="w-12 h-12 bg-gray-200 rounded-lg"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-gray-200 rounded w-3/4"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1 + 0.1,
                }}
              />
              <motion.div
                className="h-3 bg-gray-200 rounded w-1/2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1 + 0.2,
                }}
              />
            </div>
            <motion.div
              className="h-8 w-20 bg-gray-200 rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1 + 0.3,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-2">
            <motion.div
              className="h-4 bg-gray-200 rounded w-1/4"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            />
            <motion.div
              className="h-10 bg-gray-200 rounded w-full"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1 + 0.1,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <motion.div
            className="h-8 bg-gray-200 rounded w-3/4 mb-4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />
          <motion.div
            className="h-4 bg-gray-200 rounded w-full mb-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1 + 0.1,
            }}
          />
          <motion.div
            className="h-4 bg-gray-200 rounded w-2/3"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1 + 0.2,
            }}
          />
        </div>
      ))}
    </div>
  );
}

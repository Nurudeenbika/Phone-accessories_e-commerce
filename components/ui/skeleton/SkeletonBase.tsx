"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SkeletonBaseProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function SkeletonBase({
  children,
  className = "",
  animate = true,
}: SkeletonBaseProps) {
  if (!animate) {
    return <div className={`bg-gray-200 ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`bg-gray-200 ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

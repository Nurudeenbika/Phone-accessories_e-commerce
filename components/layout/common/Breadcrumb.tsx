"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MdKeyboardArrowLeft, MdHome } from "react-icons/md";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  className?: string;
}

export default function Breadcrumb({
  items,
  showBackButton = true,
  className = "",
}: BreadcrumbProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Track navigation history
  useEffect(() => {
    setNavigationHistory((prev) => {
      const newHistory = [...prev];

      // Don't add the same page consecutively
      if (newHistory[newHistory.length - 1] !== pathname) {
        newHistory.push(pathname);
      }

      // Keep only last 10 navigation items
      if (newHistory.length > 10) {
        return newHistory.slice(-10);
      }

      return newHistory;
    });
  }, [pathname]);

  // Generate breadcrumb items based on current path if not provided
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    // Always start with Home
    breadcrumbItems.push({
      label: "Home",
      href: "/",
      isCurrentPage: pathname === "/",
    });

    // Build breadcrumb from path segments
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format segment name
      let label = segment;
      if (segment === "products") label = "All Products";
      else if (segment === "categories") label = "Categories";
      else if (segment === "cart") label = "Shopping Cart";
      else if (segment === "checkout") label = "Checkout";
      else if (segment === "about") label = "About";
      else if (segment === "faq") label = "FAQ";
      else if (segment === "contact") label = "Contact";
      else if (segment === "login") label = "Login";
      else if (segment === "register") label = "Register";
      else if (segment === "admin") label = "Admin";
      else {
        // Capitalize first letter and replace dashes/underscores with spaces
        label = segment
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      const isLast = index === pathSegments.length - 1;
      breadcrumbItems.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbItems();
  const previousPage =
    navigationHistory.length > 1
      ? navigationHistory[navigationHistory.length - 2]
      : null;

  const handleBackClick = () => {
    if (previousPage) {
      router.push(previousPage);
    } else {
      router.back();
    }
  };

  return (
    <nav className={`text-sm ${className}`}>
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        {/* Back Button */}
        {showBackButton && previousPage && (
          <button
            onClick={handleBackClick}
            className="flex items-center gap-1 text-gray-600 hover:text-primary-700 transition-colors mr-2"
          >
            <MdKeyboardArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {/* Breadcrumb Items */}
        <div className="flex items-center gap-2">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <span className="text-gray-400">/</span>}

              {item.isCurrentPage ? (
                <span className="text-gray-900 font-medium flex items-center gap-1">
                  {index === 0 && <MdHome className="w-3 h-3" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                >
                  {index === 0 && <MdHome className="w-3 h-3" />}
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}

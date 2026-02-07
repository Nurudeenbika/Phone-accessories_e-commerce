"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdAnalytics,
  MdSettings,
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdStorefront,
} from "react-icons/md";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SidebarItem[];
}

export default function AdminSidebar(): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: MdDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: MdInventory,
      subItems: [
        { label: "All Products", href: "/admin/products", icon: MdInventory },
        { label: "Add Product", href: "/admin/products/new", icon: MdAdd },
      ],
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: MdShoppingCart,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: MdPeople,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: MdAnalytics,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: MdSettings,
    },
  ];

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (item: SidebarItem) => {
    if (item.subItems) {
      return item.subItems.some((subItem) => isActive(subItem.href));
    }
    return isActive(item.href);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b border-gray-200 flex items-center ${
          isCollapsed ? "justify-center p-3" : "justify-between p-4"
        }`}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MdStorefront className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Admin</h1>
              <p className="text-xs text-gray-500">Jespo Gadgets</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MdStorefront className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hover:bg-gray-100 rounded-lg transition-colors ${
            isCollapsed ? "p-1.5 mt-2" : "p-2"
          }`}
        >
          {isCollapsed ? (
            <MdChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <MdChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-2 ${isCollapsed ? "p-2" : "p-4"}`}>
        {sidebarItems.map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => !isCollapsed && toggleExpanded(item.label)}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 ${
                    isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
                  } ${
                    isParentActive(item)
                      ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {expandedItems.includes(item.label) ? (
                        <MdChevronLeft className="w-4 h-4 ml-auto" />
                      ) : (
                        <MdChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </>
                  )}
                </button>

                {!isCollapsed && expandedItems.includes(item.label) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isActive(subItem.href)
                            ? "bg-primary-100 text-primary-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center rounded-lg transition-all duration-200 ${
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
                } ${
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`border-t border-gray-200 ${isCollapsed ? "p-2" : "p-4"}`}
      >
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center">
            <p>Jespo Gadgets Admin</p>
            <p>Version 1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="text-xs text-gray-500">v1.0</div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MdAdd,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdLogout,
} from "react-icons/md";

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const tabs = [
    { id: "products", label: "Products", icon: MdInventory },
    { id: "orders", label: "Orders", icon: MdShoppingCart },
    { id: "users", label: "Users", icon: MdPeople },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <MdLogout className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button
                onClick={() => router.push("/admin/products/new")}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                <MdAdd className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-600">
                Product management interface will be implemented here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You can add, edit, and delete products from this section.
              </p>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-600">
                Order management interface will be implemented here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                View and manage customer orders from this section.
              </p>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Users</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-600">
                User management interface will be implemented here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                View and manage user accounts from this section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

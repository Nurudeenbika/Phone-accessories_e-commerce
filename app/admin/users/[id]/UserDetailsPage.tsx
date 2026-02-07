"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAttributes } from "@/models/user.model";
import { OrderAttributes } from "@/models/order.model";
import {
  MdArrowBack,
  MdPerson,
  MdEmail,
  MdAdminPanelSettings,
  MdShoppingCart,
  MdCalendarToday,
  MdPayment,
  MdInventory,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdSave,
  MdCancel,
  MdLocationOn,
} from "react-icons/md";
import toast from "react-hot-toast";

interface UserDetailsPageProps {
  user: UserAttributes;
}

export default function UserDetailsPage({ user }: UserDetailsPageProps) {
  const router = useRouter();
  const [userOrders, setUserOrders] = useState<OrderAttributes[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<UserAttributes>(user);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchUserOrders();
  }, [user.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [showOrders, userOrders.length]);

  const fetchUserOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotalSpent = () => {
    return userOrders.reduce((total, order) => {
      const amount =
        typeof order.totalAmount === "string"
          ? parseFloat(order.totalAmount)
          : Number(order.totalAmount) || 0;
      return total + amount;
    }, 0);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const paginatedOrders = userOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(userOrders.length / ordersPerPage);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          role: editedUser.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully!");
      setIsEditing(false);

      // Update the user data in the parent component
      // This will trigger a re-render with the updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserAttributes, value: string) => {
    setEditedUser({
      ...editedUser,
      [field]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MdArrowBack className="w-5 h-5" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MdPerson className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit User" : user.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isEditing
                      ? "Modify user information"
                      : "View user details"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <MdEdit className="w-4 h-4" />
                  Edit User
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 rounded-lg transition-colors"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MdSave className="w-4 h-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{user.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{user.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser.role || "USER"}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <p className="text-sm text-gray-900">N/A</p>
                </div>
              </div>
            </div>

            {/* Order History Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order History
                </h2>
                <button
                  onClick={() => setShowOrders(!showOrders)}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showOrders ? (
                    <>
                      <MdVisibilityOff className="w-4 h-4" />
                      Hide Orders
                    </>
                  ) : (
                    <>
                      <MdVisibility className="w-4 h-4" />
                      Show Orders
                    </>
                  )}
                </button>
              </div>

              {showOrders && (
                <div className="space-y-4">
                  {isLoadingOrders ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">
                        Loading orders...
                      </p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <MdShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paginatedOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <MdInventory className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Order #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ₦
                                {typeof order.totalAmount === "string"
                                  ? parseFloat(
                                      order.totalAmount,
                                    ).toLocaleString()
                                  : (
                                      Number(order.totalAmount) || 0
                                    ).toLocaleString()}
                              </p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                {order.status || "pending"}
                              </span>
                            </div>
                          </div>
                          {order.products && order.products.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">
                                Products:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {order.products
                                  .slice(0, 3)
                                  .map((product: any, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-white border border-gray-200"
                                    >
                                      {product.name} (x{product.quantity})
                                    </span>
                                  ))}
                                {order.products.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                                    +{order.products.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing {currentPage} of {totalPages} pages
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                    >
                      Prev
                    </button>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <MdShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userOrders.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <MdPayment className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{calculateTotalSpent().toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                    <MdInventory className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Last Order
                    </p>
                    <p className="text-sm text-gray-600">
                      {userOrders.length > 0
                        ? formatDate(userOrders[0].createdAt)
                        : "No orders yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowOrders(!showOrders)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MdVisibility className="w-5 h-5" />
                  {showOrders ? "Hide Order History" : "View Order History"}
                </button>
                <button
                  onClick={() => router.push(`/admin/orders?user=${user.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MdInventory className="w-5 h-5" />
                  View All Orders
                </button>
                <button
                  onClick={() =>
                    router.push(`/admin/analytics?user=${user.id}`)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MdAdminPanelSettings className="w-5 h-5" />
                  User Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

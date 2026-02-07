"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAttributes } from "@/models/user.model";
import {
  MdSearch,
  MdVisibility,
  MdPerson,
  MdEmail,
  MdAdminPanelSettings,
  MdPeople,
} from "react-icons/md";
import AdminSelect from "./AdminSelect";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";

interface UsersTableProps {
  users: UserAttributes[];
}

export default function UsersTable({
  users,
}: UsersTableProps): React.ReactElement {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    user: UserAttributes | null;
    action: string;
    newValue: string;
  }>({ isOpen: false, user: null, action: "", newValue: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      statusFilter === "active" || // All users are considered active
      (statusFilter === "inactive" && false); // No inactive users

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserUpdate = (
    user: UserAttributes,
    action: string,
    newValue: string,
  ) => {
    setUpdateModal({ isOpen: true, user, action, newValue });
  };

  const handleUserUpdateConfirm = async () => {
    if (!updateModal.user) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${updateModal.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [updateModal.action]: updateModal.newValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const actionText = updateModal.action === "role" ? "role" : "status";
      toast.success(`User ${actionText} updated successfully!`);
      setUpdateModal({ isOpen: false, user: null, action: "", newValue: "" });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUserUpdateCancel = () => {
    setUpdateModal({ isOpen: false, user: null, action: "", newValue: "" });
  };

  const handleViewUserDetails = (user: UserAttributes) => {
    router.push(`/admin/users/${user.id}`);
  };

  const getStatusColor = (isActive: boolean | undefined) => {
    return isActive === false
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <AdminSelect
            options={[
              { value: "all", label: "All Roles" },
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="All Roles"
          />

          {/* Status Filter */}
          <AdminSelect
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <MdPerson className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || "Unnamed User"}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <MdEmail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {user.role === "ADMIN" && (
                      <MdAdminPanelSettings className="w-4 h-4 text-purple-600" />
                    )}
                    <button
                      onClick={() =>
                        handleUserUpdate(
                          user,
                          "role",
                          user.role === "ADMIN" ? "USER" : "ADMIN",
                        )
                      }
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getRoleColor(user.role)}`}
                      title="Click to change role"
                    >
                      {user.role || "user"}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  N/A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewUserDetails(user)}
                    className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <MdVisibility className="w-4 h-4" />
                    View User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <MdPeople className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No users have been registered yet."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredUsers.length}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span>{" "}
                results
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Update Confirmation Modal */}
      <ConfirmModal
        isOpen={updateModal.isOpen}
        onClose={handleUserUpdateCancel}
        onConfirm={handleUserUpdateConfirm}
        title={`Update User ${updateModal.action === "role" ? "Role" : "Status"}`}
        message={`Are you sure you want to update ${updateModal.user?.name}'s ${updateModal.action} to "${updateModal.newValue}"?`}
        confirmText="Update"
        cancelText="Cancel"
        type="info"
        isLoading={isUpdating}
      />
    </div>
  );
}

import React from "react";
import { getUsers } from "@/lib/jespo/queries/user";
import { requireAdmin } from "@/lib/auth/serverAuth";
import UsersTable from "@/components/layout/admin/UsersTable";
import {
  MdPeople,
  MdPersonAdd,
  MdShoppingCart,
  MdAdminPanelSettings,
} from "react-icons/md";

export default async function AdminUsersPage() {
  // Require admin authentication
  await requireAdmin();

  const users = await getUsers();

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.length; // Assuming all users are active since there's no isActive field
  const adminUsers = users.filter((user) => user.role === "ADMIN").length;
  const regularUsers = users.filter((user) => user.role === "USER").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdPeople className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <MdPersonAdd className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <MdAdminPanelSettings className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Users</p>
              <p className="text-2xl font-bold text-blue-600">{regularUsers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  );
}

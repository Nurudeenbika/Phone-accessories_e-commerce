import React from "react";
import { requireAdmin } from "@/lib/auth/serverAuth";
import SettingsForm from "@/components/layout/admin/SettingsForm";
import {
  MdSettings,
  MdSecurity,
  MdNotifications,
  MdStore,
} from "react-icons/md";

export default async function AdminSettingsPage() {
  // Require admin authentication
  await requireAdmin();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Settings Categories
            </h3>
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary-700 bg-primary-50 rounded-lg">
                <MdStore className="w-5 h-5" />
                <span className="font-medium">Store Settings</span>
              </button>
              {/* <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <MdSecurity className="w-5 h-5" />
                <span>Security</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <MdNotifications className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <MdSettings className="w-5 h-5" />
                <span>General</span>
              </button> */}
            </nav>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}

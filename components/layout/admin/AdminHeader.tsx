"use client";

import React, { useState } from "react";
import {
  MdSearch,
  MdNotifications,
  MdAccountCircle,
  MdLogout,
  MdSettings, MdHome,
} from "react-icons/md";
import { useRouter } from "next/navigation";

export default function AdminHeader(): React.ReactElement {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left side - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MdNotifications className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <MdAccountCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                  onClick={() => {
                    //todo: action
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <MdAccountCircle className="w-4 h-4" />
                Profile
              </button>

              <button
                  onClick={() => {
                    //todo: action
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <MdSettings className="w-4 h-4" />
                Settings
              </button>

              <button
                  onClick={() => {
                    router.push("/");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <MdHome className="w-4 h-4" />
                Go to Dashboard
              </button>


              <hr className="my-2" />
              <button
                  onClick={() => {
                    //todo: action
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                <MdLogout className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

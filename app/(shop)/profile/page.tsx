"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdEdit,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { ProfileStats } from "@/app/api/types/profile-stats";
import { useFavorites } from "@/context/FavoritesContext";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  avatarUrl?: string;
}

interface AccountStats {
  account: {
    userId?: string;
    email?: string;
    role?: string;
    createdAt: string;
    hasAvatar?: boolean;
  };
  profile?: {
    exists: boolean;
    completionPercent: number;
  };
  activity?: {
    lastLogin: string | null;
  };
  stats?: {
    favorites: number;
    orders?: number;
    reviews?: number;
  };
  memberSince?: string;
}

const emptyProfile: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  gender: "prefer-not-to-say",
};

export default function ProfilePage(): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfile);
  const [editedData, setEditedData] = useState<ProfileData>(emptyProfile);
  const { status: authStatus } = useSession();
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { favoriteProducts } = useFavorites();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetch("/api/profile/me")
        .then((res) => res.json())
        .then((data) => {
          const merged: ProfileData = {
            firstName: data.profile?.firstName ?? "",
            lastName: data.profile?.lastName ?? "",
            email: data.email ?? "",
            phone: data.profile?.phone ?? "",
            address: data.profile?.address ?? "",
            dateOfBirth: data.profile?.dateOfBirth ?? "",
            gender: data.profile?.gender ?? "prefer-not-to-say",
            avatarUrl: data.avatarUrl ?? "",
          };

          setProfileData(merged);
          setEditedData(merged);
        });
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== "authenticated") return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/profile/stats");

        if (!res.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await res.json();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load account statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [authStatus]);

  const handleEdit = () => {
    setEditedData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedData) return;

    const res = await fetch("/api/profile/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedData),
    });

    if (!res.ok) {
      toast.error("Failed to update profile");
      return;
    }

    setProfileData(editedData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/profile/avatar", {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Failed to upload photo");
      return;
    }

    const data = await res.json();

    setProfileData((prev) => ({
      ...prev,
      avatarUrl: data.avatarUrl,
    }));

    toast.success("Profile photo updated");
  };

  {
    uploading ? "Uploading..." : "Change Photo";
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await fetch("/api/profile/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to change password");
      return;
    }

    toast.success("Password changed successfully");
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <MdSave className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-3 font-medium hover:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <MdCancel className="w-5 h-5" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <MdEdit className="w-5 h-5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
              {profileData.avatarUrl ? (
                <img
                  src={profileData.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdPerson className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <label className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600 mb-4">{profileData.email}</p>
          </div>

          <div className="bg-white border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Statistics
            </h3>

            {statsLoading ? (
              <p className="text-gray-500">Loading statistics...</p>
            ) : stats ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-900">
                    {Number(stats?.stats?.orders ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-semibold text-gray-900">
                    {Number(stats?.stats?.favorites ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold text-gray-900">
                    {Number(stats?.stats?.reviews ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {stats?.account?.createdAt
                      ? new Date(stats.account.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No statistics available</p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={
                      isEditing ? editedData.firstName : profileData.firstName
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={
                      isEditing ? editedData.lastName : profileData.lastName
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editedData.email : profileData.email}
                    onChange={handleChange}
                    disabled={true}
                    readOnly={true}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={isEditing ? editedData.phone : profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={isEditing ? editedData.address : profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={
                      isEditing
                        ? editedData.dateOfBirth
                        : profileData.dateOfBirth
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={isEditing ? editedData.gender : profileData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200 p-8 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Security Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-600">
                    Update your account password
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="bg-primary-600 text-white px-4 py-2 font-medium hover:bg-primary-700 transition-colors"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security
                  </p>
                </div>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 font-medium hover:bg-gray-400 transition-colors">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Login Sessions</h4>
                  <p className="text-sm text-gray-600">
                    Manage your active sessions
                  </p>
                </div>
                <button className="bg-primary-600 text-white px-4 py-2 font-medium hover:bg-primary-700 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* 🔐 Change Password Form */}
          {showPasswordForm && (
            <div className="mt-6 border border-gray-200 p-6 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Change Password</h4>

              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border"
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border"
                />

                <div className="flex gap-3">
                  <button
                    onClick={submitPasswordChange}
                    className="bg-primary-600 text-white px-6 py-2"
                  >
                    Save Password
                  </button>

                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="bg-gray-300 px-6 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white border border-gray-200 p-8 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Account Actions
            </h3>

            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Deactivate Account
              </button>
              <button className="w-full text-left p-4 border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

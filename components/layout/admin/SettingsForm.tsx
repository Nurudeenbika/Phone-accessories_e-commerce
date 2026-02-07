"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdRefresh } from "react-icons/md";
import AdminSelect from "./AdminSelect";
import toast from "react-hot-toast";

export default function SettingsForm(): React.ReactElement {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Jespo Gadgets",
    storeDescription: "Your one-stop shop for phones and accessories",
    storeEmail: "info@jespogadgets.com",
    storePhone: "+234 123 456 7890",
    storeAddress: "123 Gadget Street, Lagos, Nigeria",
    currency: "NGN",
    timezone: "Africa/Lagos",
    taxRate: 7.5,
    shippingCost: 2000,
    freeShippingThreshold: 10000,
    allowGuestCheckout: true,
    requireEmailVerification: false,
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: Implement actual API call to save settings
      // const response = await fetch("/api/admin/settings", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings)
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Settings saved successfully!");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store Information */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Store Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleInputChange("storeName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description
            </label>
            <textarea
              value={settings.storeDescription}
              onChange={(e) =>
                handleInputChange("storeDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Email
              </label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) =>
                  handleInputChange("storeEmail", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Phone
              </label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) =>
                  handleInputChange("storePhone", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Address
            </label>
            <textarea
              value={settings.storeAddress}
              onChange={(e) =>
                handleInputChange("storeAddress", e.target.value)
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Business Settings
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <AdminSelect
                options={[
                  { value: "NGN", label: "Nigerian Naira (₦)" },
                  { value: "USD", label: "US Dollar ($)" },
                  { value: "EUR", label: "Euro (€)" },
                  { value: "GBP", label: "British Pound (£)" },
                ]}
                value={settings.currency}
                onChange={(value) => handleInputChange("currency", value)}
                placeholder="Select currency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <AdminSelect
                options={[
                  { value: "Africa/Lagos", label: "Africa/Lagos" },
                  { value: "UTC", label: "UTC" },
                  { value: "America/New_York", label: "America/New_York" },
                  { value: "Europe/London", label: "Europe/London" },
                ]}
                value={settings.timezone}
                onChange={(value) => handleInputChange("timezone", value)}
                placeholder="Select timezone"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) =>
                  handleInputChange("taxRate", parseFloat(e.target.value))
                }
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost (₦)
              </label>
              <input
                type="number"
                value={settings.shippingCost}
                onChange={(e) =>
                  handleInputChange("shippingCost", parseInt(e.target.value))
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold (₦)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  handleInputChange(
                    "freeShippingThreshold",
                    parseInt(e.target.value),
                  )
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Settings */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Feature Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Allow Guest Checkout
              </h4>
              <p className="text-sm text-gray-500">
                Let customers purchase without creating an account
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowGuestCheckout}
              onChange={(e) =>
                handleInputChange("allowGuestCheckout", e.target.checked)
              }
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Require Email Verification
              </h4>
              <p className="text-sm text-gray-500">
                Users must verify their email before account activation
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) =>
                handleInputChange("requireEmailVerification", e.target.checked)
              }
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Enable Product Reviews
              </h4>
              <p className="text-sm text-gray-500">
                Allow customers to leave reviews on products
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableReviews}
              onChange={(e) =>
                handleInputChange("enableReviews", e.target.checked)
              }
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Enable Wishlist
              </h4>
              <p className="text-sm text-gray-500">
                Allow customers to save products to wishlist
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.enableWishlist}
              onChange={(e) =>
                handleInputChange("enableWishlist", e.target.checked)
              }
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Maintenance Mode
              </h4>
              <p className="text-sm text-gray-500">
                Temporarily disable the store for maintenance
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                handleInputChange("maintenanceMode", e.target.checked)
              }
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <MdRefresh className="w-4 h-4" />
          Reset to Defaults
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MdSave className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

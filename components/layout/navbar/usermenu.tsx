"use client";

import { LoggedInUserParams } from "@/lib/jespo/contracts";
import Avatar from "@/components/layout/base/avatar";
import { AiOutlineDown } from "react-icons/ai";
import {
  MdOutlineShoppingBag,
  MdOutlinePerson,
  MdOutlineShoppingCart,
  MdOutlineLogout,
  MdOutlineLogin,
  MdOutlinePersonAdd, MdSettings,
} from "react-icons/md";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function UserMenu({
  loggedInUser,
}: LoggedInUserParams): React.ReactElement {
  const { cartTotalQuantity } = useCart();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Use NextAuth's signOut method
      await signOut({
        redirect: false, // Don't redirect, we'll handle it manually
      });

      // Clear any additional stored data
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        sessionStorage.clear();
      }

      // Close dropdown
      setIsDropdownOpen(false);

      // Show success toast
      toast.success("Logged out successfully!");

      // Reload page to ensure clean logout state
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out. Please try again.");
      setIsDropdownOpen(false);
    }
  };

  // If user is not logged in, show login/register buttons
  if (!loggedInUser) {
    return (
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Cart Icon */}
        <div className="relative">
          <button
            onClick={() => router.push("/cart")}
            className="p-2 text-gray-600 hover:text-primary-700 transition-colors relative"
          >
            <MdOutlineShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
            {cartTotalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
                {cartTotalQuantity}
              </span>
            )}
          </button>
        </div>

        {/* Login and Register Buttons - Hidden on mobile, shown on tablet and up */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => router.push("/login")}
            className="px-3 lg:px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 text-sm lg:text-base"
          >
            <MdOutlineLogin className="w-4 h-4" />
            <span className="hidden lg:inline">Login</span>
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-3 lg:px-4 py-2 bg-primary-700 text-white hover:bg-primary-800 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md text-sm lg:text-base"
          >
            <MdOutlinePersonAdd className="w-4 h-4" />
            <span className="hidden lg:inline">Register</span>
          </button>
        </div>
      </div>
    );
  }

  // If user is logged in, show user menu
  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* Cart Icon */}
      <div className="relative">
        <button
          onClick={() => router.push("/cart")}
          className="p-2 text-gray-600 hover:text-primary-700 transition-colors relative"
        >
          <MdOutlineShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
          {cartTotalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">
              {cartTotalQuantity}
            </span>
          )}
        </button>
      </div>

      {/* User Menu Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 text-gray-600 hover:text-primary-700 transition-colors"
        >
          <Avatar src={""} />
          <span className="text-xs lg:text-sm font-medium hidden sm:inline">
            {loggedInUser?.name || "User"}
          </span>
          <AiOutlineDown
            className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60] transition-all duration-200 ease-in-out transform ${
            isDropdownOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >

          <button
            onClick={() => {
              router.push("/orders");
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MdOutlineShoppingCart className="w-4 h-4" />
            My Orders
          </button>

          <button
            onClick={() => {
              router.push("/profile");
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MdOutlinePerson className="w-4 h-4" />
            Profile
          </button>

          {
              loggedInUser?.role?.toLocaleLowerCase() === "admin" && (
                  <button
                      onClick={() => {
                        router.push("/admin");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <MdSettings className="w-4 h-4"/>
                    Admin
                  </button>
              )
          }


          <hr className="my-2 border-gray-100" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <MdOutlineLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

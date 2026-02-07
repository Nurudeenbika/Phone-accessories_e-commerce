"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdLogin, MdLock } from "react-icons/md";
import { ExtendedUser } from "@/lib/types/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallbackUrl?: string;
  showLoginPrompt?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  fallbackUrl = "/login",
  showLoginPrompt = true,
}: AuthGuardProps): React.ReactElement {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // Check if authentication is required
    if (requireAuth && !session) {
      if (showLoginPrompt) {
        toast.error("Login to continue");
      }
      // Capture current page URL as next parameter
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${fallbackUrl}?next=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // Check if admin role is required
    if (requireAdmin && session) {
      const userRole = (session.user as ExtendedUser)?.role;
      if (userRole?.toLowerCase() !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/");
        return;
      }
    }
  }, [
    session,
    status,
    requireAuth,
    requireAdmin,
    fallbackUrl,
    showLoginPrompt,
    router,
  ]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated and showLoginPrompt is true
  if (requireAuth && !session && showLoginPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdLock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to sign in to access this page. This helps us keep your
            data secure and organized.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors rounded-lg flex items-center gap-2"
            >
              <MdLogin className="w-5 h-5" />
              Sign In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-gray-600 text-white px-6 py-3 font-medium hover:bg-gray-700 transition-colors rounded-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied for admin-only pages
  if (
    requireAdmin &&
    session &&
    (session.user as ExtendedUser)?.role?.toLowerCase() !== "admin"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdLock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">
            You don&#39;t have the required permissions to access this page. Admin
            privileges are required.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}

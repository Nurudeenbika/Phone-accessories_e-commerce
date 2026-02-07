"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

export default function ProtectedLayout({
  children,
  redirectTo = "/login",
  requireAdmin = false,
}: ProtectedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // User is not authenticated, redirect to login
      router.push(redirectTo);
      return;
    }

    // Check if admin role is required
    if (requireAdmin) {
      const userRole = (session.user as any)?.role;
      if (userRole?.toLowerCase() !== "admin") {
        // Not admin, redirect to home
        router.push("/");
        return;
      }
    }
  }, [session, status, router, redirectTo, requireAdmin]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!session) {
    return null;
  }

  // Check admin requirement
  if (requireAdmin) {
    const userRole = (session.user as any)?.role;
    if (userRole?.toLowerCase() !== "admin") {
      return null; // Redirect will happen
    }
  }

  // User is authenticated (and admin if required), render the protected content
  return <>{children}</>;
}

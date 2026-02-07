import React from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export const metadata = {
  title: "Admin Dashboard - Jespo Gadgets",
  description: "Admin dashboard for managing products, orders, and users",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutProps): React.ReactElement {
  return (
    <ProtectedLayout requireAdmin={true}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedLayout>
  );
}

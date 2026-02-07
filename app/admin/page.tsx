import React from "react";
import { requireAdmin } from "@/lib/auth/serverAuth";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  // Require admin authentication
  await requireAdmin();

  return <DashboardClient />;
}


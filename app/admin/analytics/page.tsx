import React from "react";
import { requireAdmin } from "@/lib/auth/serverAuth";
import AnalyticsClient from "./AnalyticsClient";

export default async function AdminAnalyticsPage() {
  // Require admin authentication
  await requireAdmin();

  return <AnalyticsClient />;
}

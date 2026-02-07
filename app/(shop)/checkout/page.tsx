import React from "react";
import CheckoutClient from "./CheckoutClient";
import { requireAuth } from "@/lib/auth/serverAuth";

export default async function CheckoutPage() {
  // Require authentication for checkout
  const user = await requireAuth();

  return <CheckoutClient loggedInUser={user} />;
}

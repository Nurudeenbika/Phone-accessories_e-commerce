import React from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import OrderDetailClient from "./OrderDetailClient";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;

  try {
    const baseUrl =
        typeof window === "undefined"
            ? process.env.API_BASE_URL :
            process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/orders/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        redirect("/login");
      }
      notFound();
    }

    const result = await response.json();
    const order = result.order;

    if (!order) {
      notFound();
    }

    return <OrderDetailClient order={order} />;
  } catch (error) {
    console.error("Error fetching order:", error);
    notFound();
  }
}

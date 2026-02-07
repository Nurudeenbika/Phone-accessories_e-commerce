import React from "react";
import { getUsers } from "@/lib/jespo/queries/user";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { notFound } from "next/navigation";
import UserDetailsPage from "./UserDetailsPage";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  // Require admin authentication
  await requireAdmin();

  const { id } = await params;
  const users = await getUsers();
  const user = users.find(u => u.id === id);

  if (!user) {
    notFound();
  }

  return <UserDetailsPage user={user} />;
}

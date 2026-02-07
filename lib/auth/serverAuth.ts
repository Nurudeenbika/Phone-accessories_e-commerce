import                                                                                                                                                                                                                                                                                                    { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { User } from "@/models/user.model";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export async function requireAuth(): Promise<AuthUser> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Get full user data from database
  const user = await User.findByEmail(session.user.email!);
  if (!user) {
    redirect("/login");
  }

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role?.toLowerCase() !== "admin") {
    redirect("/");
  }

  return user;
}

export async function getOptionalAuth(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }

    // Get full user data from database
    const user = await User.findByEmail(session.user.email!);
    if (!user) {
      return null;
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  } catch (error) {
    console.error("Error getting optional auth:", error);
    return null;
  }
}

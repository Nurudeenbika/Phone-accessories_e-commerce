import { getServerSession, Session } from "next-auth";
import { User, UserAttributes } from "@/models/user.model";
import { authOptions } from "@/lib/auth/auth";

export async function getCurrentSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

export async function getLoggedInUser(): Promise<UserAttributes | null> {
  try {
    const session = await getCurrentSession();
    const email = session?.user?.email;

    if (!email) {
      return null;
    }

    return await User.findByEmail(email);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUsers(): Promise<UserAttributes[]> {
  try {
    return await User.findAll();
  } catch (error: any) {
    console.error("Error fetching users...", error);
    return [];
  }
}

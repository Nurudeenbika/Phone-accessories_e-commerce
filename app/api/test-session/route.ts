import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      session: session,
      user: session?.user,
      role: session?.user?.role,
      isAdmin: session?.user?.role === "admin",
    });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}

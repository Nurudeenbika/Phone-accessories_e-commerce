import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { User } from "@/models/user.model";
import { Profile } from "@/models/profile.model";
import { pool } from "@/lib/jespo/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await Profile.findByUserId(user.id);

    // Profile completion logic
    const completedFields = [
      profile?.firstName,
      profile?.lastName,
      profile?.phone,
      profile?.address,
      profile?.dateOfBirth,
      profile?.gender,
    ].filter(Boolean).length;

    const totalFields = 6;
    const profileCompletion = Math.round((completedFields / totalFields) * 100);

    const [[favorites]]: any = await pool.query(
      `SELECT COUNT(*) as count FROM favorites WHERE userId = ?`,
      [user.id]
    );

    const [[orders]]: any = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE userId = ?`,
      [user.id]
    );

    const [[reviews]]: any = await pool.query(
      `SELECT COUNT(*) as count FROM reviews WHERE userId = ?`,
      [user.id]
    );

    return NextResponse.json({
      account: {
        userId: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : new Date().toISOString(),
        hasAvatar: Boolean(user.image),
      },
      profile: {
        exists: Boolean(profile),
        completionPercent: profileCompletion,
      },
      activity: {
        lastLogin: user.lastLoginAt
          ? new Date(user.lastLoginAt).toISOString()
          : null,
      },
      stats: {
        favorites: favorites?.count || 0,
        orders: orders?.count || 0,
        reviews: reviews?.count || 0,
      },
    });
  } catch (error) {
    console.error("Profile stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

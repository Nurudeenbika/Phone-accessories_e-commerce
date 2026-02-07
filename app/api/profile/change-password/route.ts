import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { pool } from "@/lib/jespo/db";

// 🔐 Password strength validation
function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function PUT(req: NextRequest) {
  try {
    // 1️⃣ Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 },
      );
    }

    // 2️⃣ Password strength validation
    if (!isStrongPassword(newPassword)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
        },
        { status: 400 },
      );
    }

    // 3️⃣ Fetch user password hash
    const [rows]: any = await pool.query(
      "SELECT id, hashedPassword FROM users WHERE id = ? LIMIT 1",
      [session.user.id],
    );

    if (!rows.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    if (!user.hashedPassword) {
      return NextResponse.json(
        { message: "Password login is not enabled for this account" },
        { status: 400 },
      );
    }

    // 4️⃣ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // 5️⃣ Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    // 6️⃣ Update password
    await pool.query(
      `
      UPDATE users
      SET hashedPassword = ?, updatedAt = NOW()
      WHERE id = ?
      `,
      [newHashedPassword, session.user.id],
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

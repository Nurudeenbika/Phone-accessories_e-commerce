import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { User } from "@/models/user.model";
import { ExtendedUser } from "@/lib/types/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/users/[id] - Get specific user
export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user as ExtendedUser)?.role?.toLowerCase() !== "admin"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user as ExtendedUser)?.role?.toLowerCase() !== "admin"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, isActive } = body;

    const updateData: {
      name?: string;
      email?: string;
      role?: "USER" | "ADMIN";
      isActive?: boolean;
    } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && (role === "USER" || role === "ADMIN")) updateData.role = role;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    const updated = await User.update(id, updateData);

    if (!updated) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user as ExtendedUser)?.role?.toLowerCase() !== "admin"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === (session.user as ExtendedUser).id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const deleted = await User.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "User not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}

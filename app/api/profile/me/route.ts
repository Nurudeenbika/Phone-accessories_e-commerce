import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { User } from "@/models/user.model";
import { Profile } from "@/models/profile.model";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findByIdWithProfile(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.image,
    role: user.role,
    profile: user.profile,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await Profile.updateByUserId(session.user.id, {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    address: body.address,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
  });

  return NextResponse.json({ success: true });
}

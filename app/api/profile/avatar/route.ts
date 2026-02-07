import { storage } from "./../../../../lib/firebase/config";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { uploadFile, validateImageFile } from "@/lib/cloudinary/storage";
import { User } from "@/models/user.model";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
  }

  // ✅ Validate image (uses your helper)
  try {
    validateImageFile(file);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // ✅ Upload to Cloudinary (reuse your util)
  const avatarUrl = await uploadFile(file, "avatars");

  // ✅ Persist avatar
  await User.updateImage(session.user.id, avatarUrl);

  return NextResponse.json({
    success: true,
    avatarUrl,
  });
}

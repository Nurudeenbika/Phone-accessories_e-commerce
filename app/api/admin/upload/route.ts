import { NextRequest, NextResponse } from "next/server";
import { uploadFile, validateImageFile } from "@/lib/cloudinary/storage";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ message: "Upload API is working" });
}

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", file?.name, file?.size, file?.type);

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    try {
      validateImageFile(file);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 },
      );
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary:", file.name);
    const downloadURL = await uploadFile(file, "products/temp");
    console.log("Cloudinary cloud-upload completed, URL:", downloadURL);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      filename: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    return NextResponse.json(
      {
        error: "Failed to cloud-upload file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

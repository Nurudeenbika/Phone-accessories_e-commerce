import cloudinary from "./config";
import fs from "fs";
import path from "path";

/**
 * Upload a local image file to Cloudinary
 * @param localImagePath - Path to the local image file
 * @param folder - The folder to cloud-upload to (optional)
 * @param publicId - Custom public ID (optional)
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export async function uploadLocalImage(
  localImagePath: string,
  folder: string = "products",
  publicId?: string,
): Promise<string> {
  try {
    console.log("Starting Cloudinary cloud-upload for local file:", localImagePath);

    // Check if file exists
    if (!fs.existsSync(localImagePath)) {
      throw new Error(`Local file not found: ${localImagePath}`);
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        localImagePath,
        {
          folder: folder,
          public_id: publicId,
          resource_type: "auto",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" }, // Limit max size
            { quality: "auto" }, // Auto quality optimization
            { fetch_format: "auto" }, // Auto format (WebP when supported)
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary cloud-upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary cloud-upload successful:", result?.secure_url);
            resolve(result);
          }
        },
      );
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Error uploading local image to Cloudinary:", error);
    throw new Error(
      `Failed to upload local image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Upload the default product image to Cloudinary
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export async function uploadDefaultProductImage(): Promise<string> {
  const defaultImagePath = path.join(process.cwd(), "public", "prods.jpg");
  return uploadLocalImage(
    defaultImagePath,
    "products",
    "default-product-image",
  );
}

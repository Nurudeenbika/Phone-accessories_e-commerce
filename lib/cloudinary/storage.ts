import cloudinary from "./config";
import {ImageType} from "@/lib/jespo/types";

/**
 * Upload a file to Cloudinary
 * @param file - The file to cloud-upload
 * @param folder - The folder to cloud-upload to (optional)
 * @returns Promise<string> - The secure URL of the uploaded image
 */
export async function uploadFile(
  file: File,
  folder: string = "products",
): Promise<string> {
  try {
    console.log("Starting Cloudinary cloud-upload for file:", file.name);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
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
        )
        .end(buffer);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Delete a file from Cloudinary
 * @param url - The URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract public_id from URL
    const publicId = extractPublicId(url);
    if (!publicId) {
      throw new Error("Invalid Cloudinary URL");
    }

    await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Generate a unique filename for product images
 * @param originalName - The original filename
 * @param productId - The product ID
 * @returns string - The new filename
 */
export function generateImageFilename(
  originalName: string,
  productId: string,
): string {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  return `${productId}_${timestamp}.${extension}`;
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns boolean - Whether the file is valid
 */
export function validateImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size too large. Maximum size is 10MB.");
  }

  return true;
}

/**
 * Extract public_id from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns string | null - The public_id
 */
function extractPublicId(url: string): string | null {
  try {
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    return filename.split(".")[0];
  } catch {
    return null;
  }
}


export async function uploadImages(images: ImageType[] | null): Promise<string[]> {

  if(!images || images.length === 0) return [];
  const urls: string[] = [];

  for(const img of images) {
    if(!(img.image instanceof File)) continue;

    const buffer = Buffer.from(await img.image.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
          .upload_stream(
              {
                folder: "products",
                resource_type: "image",
              },
              (error, result) => {
                if(error) reject(error);
                else resolve(result);
              }
          )
          .end(buffer);
    });

    urls.push(result.secure_url);
  }

  return urls;
}
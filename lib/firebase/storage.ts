import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a file to Firebase Storage
 * @param file - The file to cloud-upload
 * @param path - The path in storage (e.g., 'products/image.jpg')
 * @returns Promise<string> - The download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    console.log("Creating storage reference for path:", path);
    // Create a reference to the file location
    const storageRef = ref(storage, path);

    console.log("Uploading file to Firebase Storage...");
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload completed, getting download URL...");

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL obtained:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Delete a file from Firebase Storage
 * @param url - The download URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // Create a reference from the URL
    const storageRef = ref(storage, url);

    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
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
  return `products/${productId}/${timestamp}.${extension}`;
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

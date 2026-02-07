"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MdAdd, MdDelete, MdCloudUpload } from "react-icons/md";
import toast from "react-hot-toast";

// File validation function (matches Cloudinary validation)
function validateImageFile(file: File): boolean {
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

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  existingImages?: string[];
  onImagesChange: (images: ImageFile[]) => void;
  onExistingImagesChange?: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUploader({
  images = [],
  existingImages = [],
  onImagesChange,
  onExistingImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploaderProps): React.ReactElement {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const totalImages = images.length + existingImages.length + newFiles.length;

    if (totalImages > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      try {
        validateImageFile(file);
        validFiles.push(file);
      } catch (error) {
        errors.push(
          `${file.name}: ${error instanceof Error ? error.message : "Invalid file"}`,
        );
      }
    });

    if (errors.length > 0) {
      toast.error(`Some files were invalid: ${errors.join(", ")}`);
    }

    if (validFiles.length > 0) {
      // Create image objects with file and preview
      const newImageFiles = validFiles.map((file) => {
        const imageFile = {
          file,
          preview: URL.createObjectURL(file),
        };
        console.log(
          "Created image file object:",
          imageFile.file.name,
          imageFile.file.size,
          imageFile.file.type,
        );
        return imageFile;
      });

      const updatedImages = [...images, ...newImageFiles];
      onImagesChange(updatedImages);

      toast.success(`${validFiles.length} image(s) added successfully!`);
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove) {
      // Clean up the preview URL to prevent memory leaks
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Image removed");
  };

  const removeExistingImage = (index: number) => {
    if (onExistingImagesChange) {
      const newExistingImages = existingImages.filter((_, i) => i !== index);
      onExistingImagesChange(newExistingImages);
      toast.success("Image removed");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            dragOver
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${uploading ? "pointer-events-none" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <MdCloudUpload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Click to select or drag and drop images
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {images.length + existingImages.length}/{maxImages} images
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {(images.length > 0 || existingImages.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {/* Existing Images */}
            {existingImages.map((imageUrl, index) => (
              <motion.div
                key={`existing-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                  <Image
                    src={imageUrl}
                    alt={`Existing product image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => {
                      console.error("Existing image failed to load:", imageUrl);
                    }}
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeExistingImage(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdDelete className="w-3 h-3" />
                </button>

                {/* Image Number Badge */}
                <div className="absolute bottom-2 left-2 bg-blue-500 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>

                {/* Existing Badge */}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Existing
                </div>
              </motion.div>
            ))}

            {/* New Images */}
            {images.map((image, index) => (
              <motion.div
                key={`new-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                  <Image
                    src={image.preview}
                    alt={`New product image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => {
                      console.error("New image failed to load:", image.preview);
                    }}
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdDelete className="w-3 h-3" />
                </button>

                {/* Image Number Badge */}
                <div className="absolute bottom-2 left-2 bg-green-500 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {existingImages.length + index + 1}
                </div>

                {/* New Badge */}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add More Button */}
      {(images.length > 0 || existingImages.length > 0) &&
        images.length + existingImages.length < maxImages &&
        !uploading && (
          <button
            onClick={openFileDialog}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdAdd className="w-4 h-4" />
            Add More Images
          </button>
        )}
    </div>
  );
}

"use client";

import {
  TextFieldParams,
  CategoryInputParams,
  ColorSelectorParams,
  ImageSelectorParams,
} from "@/lib/jespo/contracts";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@/components/layout/common/button";

export function TextField({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
}: TextFieldParams) {
  const parentClassname = `w-full`;
  const inputClassname = `w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 
        rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent
        transition-all duration-200 placeholder-gray-400
        ${errors[id] ? "border-red-300 focus:ring-red-200" : "hover:bg-gray-100"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  const labelClassname = `block text-sm font-medium text-gray-700 mb-2
        ${errors[id] ? "text-red-600" : ""}`;

  return (
    <div className={parentClassname}>
      <label htmlFor={id} className={labelClassname}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={`Enter your ${label.toLowerCase()}`}
        type={type}
        className={inputClassname}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{label} is required</p>
      )}
    </div>
  );
}

export function CategoryInput({
  selected,
  label,
  Icon,
  onClick,
}: CategoryInputParams): React.ReactElement {
  const parentClassname = `rounded-xl border-2 p-4 flex flex-col items-center 
    gap-2 hover:border-primary-500 transition cursor-pointer active:scale-95 
    ${selected ? "border-primary-500" : "border-primary-200"}`;
  const fontClassname = `font-medium`;

  return (
    <div onClick={() => onClick(label)} className={parentClassname}>
      <Icon size={30} />
      <div className={fontClassname}>{label}</div>
    </div>
  );
}

export function ImageSelector({
  item,
  handleFileChange,
}: ImageSelectorParams): React.ReactElement {
  const parentClassname = `border-2 border-primary-400 p-2 border-dashed cursor-pointer text-sm font-normal text-primary-400 flex items-center justify-center`;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
  });

  return (
    <div {...getRootProps()} className={parentClassname}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>+ {item?.color} Image</p>
      )}
    </div>
  );
}

export function ColorSelector({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
  previousImages = [],
}: ColorSelectorParams): React.ReactElement {
  const parentClassname = `grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-primary-200 items-center p-2`;
  const paletteClassname = `flex flex-row gap-2 items-center h-[60px]`;
  const inputClassname = `cursor-pointer h-[19px] w-[19px]`;
  const labelClassname = `font-medium cursor-pointer`;
  const selectedImageClassname = `col-span-2 text-center`;
  const buttonContainerClassname = `flex flex-row gap-2 text-sm col-span-2 items-center justify-between`;
  const buttonClassname = `w-[70px]`;

  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | string | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  useEffect(() => {
    if (previousImages.length > 0) {
      setIsSelected(true);
      setFile(previousImages[0].image);
    }
  }, []);

  const handleFileChange = useCallback((value: File) => {
    setFile(value);
    addImageToState({ ...item, image: value });
  }, []);

  const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);

    if (!e.target.checked) {
      setFile(null);
      removeImageFromState(item);
    }
  }, []);

  return (
    <div className={parentClassname}>
      <div className={paletteClassname}>
        <input
          id={item.color}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className={inputClassname}
        />
        <label htmlFor={item.color} className={labelClassname}>
          {item.color}
        </label>
      </div>

      <>
        {isSelected && !file && (
          <div className={selectedImageClassname}>
            <ImageSelector item={item} handleFileChange={handleFileChange} />
          </div>
        )}

        {file && (
          <div className={buttonContainerClassname}>
            <p>{typeof file === "string" ? "Uploaded Image" : file?.name}</p>
            <div className={buttonClassname}>
              <Button
                label="Cancel"
                small
                outline
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect } from "react";
import Heading from "@/components/layout/common/heading";
import { TextField } from "@/components/layout/common/input";
import { ImageType } from "@/lib/jespo/types";
import { FieldValues, useForm } from "react-hook-form";
import {
  AdminAddProductFormTextFieldContainer,
  AdminAddProductSelectCategoryContainer,
} from "@/components/layout/admin/AdminContainer";
import CustomCheckBox from "@/components/layout/common/checkbox";
import { productCategories } from "@/lib/utils/data/productcategories";
import { productColors } from "@/lib/utils/data/productColors";
import AdminCategoryInput from "@/components/layout/admin/AdminCategoryInput";
import { ColorSelector } from "@/components/layout/common/input";
import Button from "@/components/layout/common/button";
import toast from "react-hot-toast";


export default function AddProductForm(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);

  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
      list: "",
    },
  });

  function setCustomValue(
    id: string,
    value: string | number | boolean | ImageType[],
  ) {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  useEffect(() => {
    setCustomValue("images", images || []);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const imageUrls: string[] = [];

      if(images && images.length > 0) {
        const imagePayload = await Promise.all(
            images.map(async (img) => {
              if(!(img.image instanceof File)) return null;

              const arrayBuffer = await img.image.arrayBuffer();
              return {
                image: { data: Array.from(new Uint8Array(arrayBuffer)) },
              };
            })
        )

        const filteredPayload = imagePayload.filter(Boolean);
        const imageResponse = await fetch("/api/admin/products/cloud-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: filteredPayload }),
        });

        const data = await imageResponse.json();

        if(!imageResponse.ok) throw new Error(data.error || "Failed to upload");

        imageUrls.push(data.urls);
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("list", data.list.toString());
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      formData.append("inStock", data.inStock.toString());

      if (imageUrls && imageUrls.length > 0) {
        imageUrls
            .forEach((url) => {
              formData.append("images", url);
            });
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        setIsProductCreated(true);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  //const category = watch("category");

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }

      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        return prev.filter((item) => item.color !== value.color);
      }

      return prev;
    });
  }, []);

  return (
    <>
      <Heading title={"Add a product"} center />
      <TextField
        id="name"
        label="Name"
        disabled={false}
        register={register}
        errors={errors}
        required
      />

      <AdminAddProductFormTextFieldContainer>
        <TextField
          id="price"
          label="Price"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
        />

        <TextField
          id="list"
          label="List"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
        />
      </AdminAddProductFormTextFieldContainer>

      <TextField
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <TextField
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <CustomCheckBox
        id="inStock"
        register={register}
        label="This product is in stock"
      />

      <AdminAddProductSelectCategoryContainer
        categories={
          <>
            {productCategories.map((item) => {
              if (item.label === "All") {
                return null;
              }

              return (
                <AdminCategoryInput
                  key={item.label}
                  onClick={(i) => setCustomValue("category", i)}
                  selected={"category" === item.label}
                  label={item.label}
                  Icon={item.Icon}
                />
              );
            })}
          </>
        }
        colors={
          <>
            {productColors.map((item, index) => {
              return (
                <ColorSelector
                  key={index}
                  item={item}
                  addImageToState={addImageToState}
                  removeImageFromState={removeImageFromState}
                  isProductCreated={isProductCreated}
                />
              );
            })}
          </>
        }
      />

      <Button
        label={isLoading ? "Loading..." : "Add Product"}
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
}

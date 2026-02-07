"use client";

import { SelectedImageType } from "@/lib/jespo/types";
import { ImageType } from "@/lib/jespo/types";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ProductAttributes } from "@/models/product.model";
import Heading from "@/components/layout/common/heading";
import { ColorSelector, TextField } from "@/components/layout/common/input";
import {
  AdminAddProductFormTextFieldContainer,
  AdminAddProductSelectCategoryContainer,
} from "@/components/layout/admin/AdminContainer";
import CustomCheckBox from "@/components/layout/common/checkbox";
import { productCategories } from "@/lib/utils/data/productcategories";
import AdminCategoryInput from "@/components/layout/admin/AdminCategoryInput";
import { productColors } from "@/lib/utils/data/productColors";
import Button from "@/components/layout/common/button";

export default function EditProductForm({
  product,
}: {
  product: ProductAttributes;
}): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [oldImages, setOldImages] = useState<SelectedImageType[]>();

  useEffect(() => {
    setCustomValue("name", product.name);
    setCustomValue("description", product.description || "");
    setCustomValue("brand", product.brand || "");
    setCustomValue("category", product.category || "");
    setCustomValue("inStock", product.inStock || false);
    setCustomValue("price", product.price || 0);
    setCustomValue("list", product.list || 0);
    setOldImages(
      product.images?.map((img, index) => ({
        color: `Color ${index + 1}`,
        colorCode: "#000000",
        image: img,
      })) || [],
    );
  }, []);

  const {
    register,
    setValue,
    watch,
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

  const setCustomValue = (
    id: string,
    value: string | number | boolean | ImageType[],
  ) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    setCustomValue("images", images || []);
  }, [images]);

  //todo: onsubmit
  const onSubmit = () => {
    setIsLoading(true);
  };

  const category = watch("category");

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
      <Heading title={"Edit a Product"} />
      <TextField
        id="name"
        label="Name"
        disabled={isLoading}
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
          required
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
        id={"inStock"}
        label={"This product is in stock"}
        register={register}
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
                  selected={category === item.label}
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
                  isProductCreated={false}
                  previousImages={oldImages?.filter((image) => {
                    if (image.color === item.color) {
                      return image;
                    }
                  })}
                />
              );
            })}
          </>
        }
      />

      <Button
        label={isLoading ? "Loading..." : "Save Product"}
        disabled={isLoading}
        onClick={() => {
          onSubmit();
        }}
      />
    </>
  );
}

"use client";

import { UseCategoryParams } from "@/lib/jespo/contracts";
import React from "react";
import useCategories from "@/lib/utils/hooks/usecategories";

export default function FooterProductCategory({
  title,
  label,
}: UseCategoryParams): React.ReactElement {
  const parentClassname = "hover:text-white transition cursor-pointer";
  const { onHandleCategoryChanged } = useCategories({ title, label });

  return (
    <div>
      {label && (
        <div className={parentClassname} onClick={onHandleCategoryChanged}>
          {title}
        </div>
      )}
    </div>
  );
}

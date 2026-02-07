import { CategoryInputParams } from "@/lib/jespo/contracts";
import React from "react";
import { CategoryInput } from "@/components/layout/common/input";

export default function AdminCategoryInput({
  selected,
  label,
  Icon,
  onClick,
}: CategoryInputParams): React.ReactElement {
  const parentClassname = `col-span`;

  return (
    <div key={label} className={parentClassname}>
      <CategoryInput
        selected={selected}
        label={label}
        Icon={Icon}
        onClick={onClick}
      />
    </div>
  );
}

"use client";

import { CustomCheckBoxParams } from "@/lib/jespo/contracts";
import React from "react";

export default function CustomCheckBox({
  id,
  label,
  disabled,
  register,
}: CustomCheckBoxParams): React.ReactElement {
  const parentClassname = `group w-full flex flex-row gap-2 items-center`;
  const inputClassname = `h-[19px] w-[19px] cursor-pointer`;
  const labelClassname = `text-[1.06rem] font-medium cursor-pointer`;

  return (
    <div className={parentClassname}>
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        {...register(id)}
        placeholder=""
        className={inputClassname}
      />
      <label htmlFor={id} className={labelClassname}>
        {label}
      </label>
    </div>
  );
}

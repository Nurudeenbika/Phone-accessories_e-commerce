import { AboutCompanyParams } from "@/lib/jespo/contracts";
import React from "react";

export default function AboutCompany({
  header,
  body,
  copyright,
}: AboutCompanyParams): React.ReactElement {
  const parentClassname = "w-full md:w-1/3 mb-6 md:mb-0";
  const headerClassname = "text-base font-bold mb-2";
  const bodyClassname = "mb-2";

  return (
    <div className={parentClassname}>
      <h3 className={headerClassname}>{header}</h3>
      <p className={bodyClassname}>{body}</p>
      {copyright && <h4>{copyright}</h4>}
    </div>
  );
}

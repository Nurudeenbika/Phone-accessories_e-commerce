import React from "react";
import { FooterListParams } from "@/lib/jespo/contracts";

export default function FooterList({
  header,
  children,
}: FooterListParams): React.ReactElement {
  const parentClassname =
    "flex flex-col w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-6 gap-2";
  const headerClassname = "font-bold text-base mb-2";

  return (
    <div className={parentClassname}>
      {header && <h3 className={headerClassname}>{header}</h3>}
      {children}
    </div>
  );
}

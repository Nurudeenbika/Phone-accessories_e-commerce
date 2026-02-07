import React from "react";
import { ContainerParams } from "@/lib/jespo/contracts";

export default function Container({
  children,
}: ContainerParams): React.ReactElement {
  const containerClassname = "max-w-[1920px] mx-auto px-4 md:px-2 xl:px-20";

  return <div className={containerClassname}>{children}</div>;
}

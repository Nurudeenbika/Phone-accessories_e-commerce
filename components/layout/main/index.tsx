import React from "react";
import { ContainerParams } from "@/lib/jespo/contracts";

export default function MainContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = "flex-grow px-4 sm:px-6 lg:px-20 py-6";

  return <main className={parentClassname}>{children}</main>;
}

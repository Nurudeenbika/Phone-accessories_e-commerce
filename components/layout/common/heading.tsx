import { HeadingParams } from "@/lib/jespo/contracts";
import React from "react";

export default function Heading({
  title,
  center,
  custom,
}: HeadingParams): React.ReactElement {
  const parentClassname = `${custom} ${center ? "text-center" : "text-start"}`;
  const textClassname = `font-bold text-2xl`;

  return (
    <div className={parentClassname}>
      <h1 className={textClassname}>{title}</h1>
    </div>
  );
}

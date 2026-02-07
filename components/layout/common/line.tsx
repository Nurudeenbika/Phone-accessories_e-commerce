import React from "react";
import { HorizontalLineParams } from "@/lib/jespo/contracts";

export function HorizontalLine({
  or,
}: HorizontalLineParams): React.ReactElement {
  const parentClassname = "w-full relative";
  const lineClassname = "bg-primary-300 w-full h-px";
  const textClassname =
    "absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-50 px-4";

  return (
    <div className={parentClassname}>
      <hr className={lineClassname} />
      {or && <span className={textClassname}>or</span>}
    </div>
  );
}

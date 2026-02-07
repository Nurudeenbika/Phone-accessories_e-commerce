import { SimpleContainerParams } from "@/lib/jespo/contracts";
import React from "react";

export default function SimpleContainer({
  classname,
  children,
}: SimpleContainerParams): React.ReactElement {
  if (classname === null) {
    return <div>{children}</div>;
  } else {
    return <div className={classname}>{children}</div>;
  }
}

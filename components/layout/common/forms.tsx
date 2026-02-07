import { ContainerParams } from "@/lib/jespo/contracts";
import React from "react";

export function FormWrap({ children }: ContainerParams): React.ReactElement {
  const parentClassname = `flex items-center justify-center py-16`;
  const childClassname = `max-w-[650px] w-full flex flex-col gap-5 items-center 
    shadow-xl shadow-primary-400 bg-primary-50 rounded-md p-4 md:p-8`;

  return (
    <div
      className={parentClassname}
      style={{ minHeight: "calc(100vh - 430px)" }}
    >
      <div className={childClassname}>{children}</div>
    </div>
  );
}

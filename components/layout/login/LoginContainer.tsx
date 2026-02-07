import { ContainerParams } from "@/lib/jespo/contracts";
import React from "react";
import Container from "@/components/layout/base/container";

export default function LoginContainer({
  children,
}: ContainerParams): React.ReactElement {
  const classname = "flex items-center justify-center py-16";
  const childClassname = `max-w-[650px] w-full flex flex-col gap-5 items-center shadow-xl shadow-primary-400
       bg-primary-50 rounded-md p-4 md:p-8`;

  return (
    <Container>
      <div className={classname} style={{ minHeight: "calc(100vh - 430px)" }}>
        <div className={childClassname}>{children}</div>
      </div>
    </Container>
  );
}

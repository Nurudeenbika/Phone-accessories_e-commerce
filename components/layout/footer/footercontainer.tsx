import Container from "@/components/layout/base/container";
import { ContainerParams } from "@/lib/jespo/contracts";
import React from "react";

export default function FooterContainer({
  children,
}: ContainerParams): React.ReactElement {
  const parentClassname = "bg-gray-900 text-gray-300 text-sm mt-16";
  const firstRowClassname =
    "px-8 flex flex-col md:flex-row justify-between pt-10 pb-6";
  const secondRowClassname =
    "px-8 py-4 border-t border-gray-700 text-center text-gray-400";

  return (
    <footer className={parentClassname}>
      <Container>
        {/* First Row - Main Footer Content */}
        <div className={firstRowClassname}>{children}</div>

        {/* Second Row - Copyright */}
        <div className={secondRowClassname}>
          <p>&copy; 2024 Jespo Gadgets. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

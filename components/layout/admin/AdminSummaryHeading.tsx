import { HeadingParams } from "@/lib/jespo/contracts";
import React from "react";
import Heading from "@/components/layout/common/heading";

export default function AdminSummaryHeading({
  title,
  center,
  custom,
}: HeadingParams): React.ReactElement {
  const parentClassname = `mb-4 mt-8`;

  return (
    <div className={parentClassname}>
      <Heading center={center} title={title} custom={custom} />
    </div>
  );
}

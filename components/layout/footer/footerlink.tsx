import Link from "next/link";
import { FooterLinkParams } from "@/lib/jespo/contracts";
import React from "react";

export function FooterLink({
  url,
  label,
  classname,
  Icon,
}: FooterLinkParams): React.ReactElement {
  const destination = url ? url : "#";

  if (Icon === null) {
    return (
      <Link href={destination} className={classname}>
        {label}
      </Link>
    );
  } else {
    return (
      <Link href={destination}>
        {Icon && <Icon className={classname} aria-label={label} />}
      </Link>
    );
  }
}

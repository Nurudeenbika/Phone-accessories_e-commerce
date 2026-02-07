import { LinkItem } from "@/lib/jespo/types";
import Link from "next/link";
import { ContainerParams } from "@/lib/jespo/contracts";

export function AuthLink({ label, url, Icon }: LinkItem): React.ReactElement {
  const link = url ? url : "";

  return (
    <Link href={link} className={"underline"}>
      {label}
    </Link>
  );
}

export function LoginLinkContainer({ children }: ContainerParams) {
  const parentClassname = `text-sm`;

  return <p className={parentClassname}>Already have an account? {children}</p>;
}

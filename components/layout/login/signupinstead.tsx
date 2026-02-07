import React from "react";
import Link from "next/link";

export default function SignUpInstead(): React.ReactElement {
  const parentClassname = "text-sm";
  const linkClassname = "underline";

  return (
    <p className={parentClassname}>
      Don&apos;t have an account yet?{" "}
      <Link href={"/register"} className={linkClassname}>
        Sign up
      </Link>
    </p>
  );
}

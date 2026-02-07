"use client";

import { EmptyPageParams } from "@/lib/jespo/contracts";
import React, { useEffect } from "react";
import { EmptyCartParams } from "@/lib/jespo/contracts";
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function EmptyPage({
  title,
  subtitle,
}: EmptyPageParams): React.ReactElement {
  const parentClassname =
    "w-full h-[50vh] flex flex-col items-center justify-center h-screen text-xl md:text-2xl";
  const headerClassname = "font-bold";
  const childClassname = "font-normal text-sm";
  const containerClassname = "text-center space-y-2";

  const router = useRouter();

  useEffect(() => {
    router.push("login");
    router.refresh();
  }, []);

  return (
    <div className={parentClassname}>
      <div className={containerClassname}>
        <h4 className={headerClassname}>{title}</h4>
        {subtitle && <p className={childClassname}>{subtitle}</p>}
      </div>
    </div>
  );
}

export function EmptyCart({
  title,
  subtitle,
  url,
}: EmptyCartParams): React.ReactElement {
  const parentClassname = `flex justify-center items-center gap-4 sm:gap-8`;
  const linkClassname = `text-primary-500 flex items-center justify gap-1 mt-2 hover:scale-110 active:scale-100 transition`;
  const titleClassname = `text-2xl`;
  const titleContainerClassname = `flex flex-col items-start justify-center`;
  const iconClassname = `p-4 sm:p-6 border-4 border-primary-700 rounded-full`;

  return (
    <div
      className={parentClassname}
      style={{ minHeight: "calc(100vh - 430px)" }}
    >
      <div className={iconClassname}>
        <IoCartOutline size={70} />
      </div>
      <div className={titleContainerClassname}>
        <div className={titleClassname}>{title}</div>
        <div>
          <Link href={url} className={linkClassname}>
            <MdArrowBack />
            <span>{subtitle}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFound(): React.ReactElement {
  const parentClassname =
    "w-full h-[50vh] flex flex-col items-center justify-center h-screen text-xl md:text-2xl";
  const headerClassname = "font-bold";
  const childClassname = "font-normal text-sm";
  const containerClassname = "text-center space-y-2";

  const router = useRouter();

  useEffect(() => {
    router.push("login");
    router.refresh();
  }, []);

  return (
    <div className={parentClassname}>
      <div className={containerClassname}>
        <h4 className={headerClassname}>Page Not Found</h4>
        <p className={childClassname}>Please check and try again</p>
      </div>
    </div>
  );
}

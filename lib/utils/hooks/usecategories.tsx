"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { UseCategoryParams } from "@/lib/jespo/contracts";

export default function useCategories({ label }: UseCategoryParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onHandleCategoryChanged = useCallback(() => {
    if (label === null) {
      router.push("/");
    } else {
      let currentQuery = {};
      if (searchParams) {
        currentQuery = queryString.parse(searchParams.toString());
      }

      const updatedQuery = {
        ...currentQuery,
        category: label,
      };

      const url = queryString.stringify(
        {
          url: "/",
          query: updatedQuery,
        },
        { skipNull: true },
      );

      router.push(url);
    }
  }, [label, searchParams, router]);

  return { onHandleCategoryChanged };
}

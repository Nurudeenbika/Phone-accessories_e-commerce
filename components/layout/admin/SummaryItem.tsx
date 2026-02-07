import React from "react";

//key, label, value
import { AdminSummaryBodyParams } from "@/lib/jespo/contracts";
import FormatPrice from "@/lib/utils/numbers/FormatPrice";
import FormatNumber from "@/lib/utils/numbers/FormatNumber";

export default function AdminSummaryItem({
  topic,
  label,
  value,
}: AdminSummaryBodyParams): React.ReactElement {
  const parentClassname = `rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition`;
  const childClassname = `text-xl md:text-4xl font-bold`;

  return (
    <div key={topic} className={parentClassname}>
      <div className={childClassname}>
        {label === "Total Sale" ? (
          <>{FormatPrice(value)}</>
        ) : (
          <>{FormatNumber(value)}</>
        )}
      </div>
      <div>{label}</div>
    </div>
  );
}

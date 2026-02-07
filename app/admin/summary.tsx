"use client";

import React, { useState, useEffect } from "react";
import { AdminSummaryParams } from "@/lib/jespo/contracts";
import { AdminSummaryContainer } from "@/components/layout/admin/AdminContainer";
import AdminSummaryHeading from "@/components/layout/admin/AdminSummaryHeading";
import { AdminSummaryBodyContainer } from "@/components/layout/admin/AdminContainer";
import { SummaryDataType } from "@/lib/jespo/types";
import AdminSummaryItem from "@/components/layout/admin/SummaryItem";
import { OrderAttributes } from "@/models/order.model";

export default function Summary({
  products,
  orders,
  users,
}: AdminSummaryParams): React.ReactElement {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sale: {
      label: "Total Sale",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Paid Orders",
      digit: 0,
    },
    unpaidOrders: {
      label: "Unpaid Orders",
      digit: 0,
    },
    users: {
      label: "Total Users",
      digit: 0,
    },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      const tempData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if (item.status === "delivered" || item.status === "shipped") {
          const amount =
            typeof item.totalAmount === "string"
              ? parseFloat(item.totalAmount)
              : (item.totalAmount ?? 0);
          return acc + amount;
        } else return acc;
      }, 0);

      const paidOrders: OrderAttributes[] = orders.filter((order) => {
        return order?.status === "delivered" || order?.status === "shipped";
      });

      const unpaidOrders = orders.filter((order) => {
        return order.status === "pending" || order.status === "processing";
      });

      tempData.sale.digit = totalSale;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrders.length;
      tempData.unpaidOrders.digit = unpaidOrders.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [orders, products, users]);

  const summaryKeys = Object.keys(summaryData);

  return (
    <AdminSummaryContainer>
      <AdminSummaryHeading title={"Stats"} center />
      <AdminSummaryBodyContainer>
        {summaryKeys &&
          summaryKeys.map((key) => (
            <AdminSummaryItem
              key={key}
              topic={key}
              label={summaryData[key].label}
              value={summaryData[key].digit}
            />
          ))}
      </AdminSummaryBodyContainer>
    </AdminSummaryContainer>
  );
}

import { Order, OrderAttributes } from "@/models/order.model";
import dayjs from "dayjs";

export async function getOrderGraphData() {
  try {
    const startDate = dayjs().subtract(6, "days").startOf("day");
    const endDate = dayjs().endOf("day");

    const orders: OrderAttributes[] = await Order.findAll();

    const aggregatedData: {
      [day: string]: {
        day: string;
        date: string;
        totalAmount: number;
        totalOrders: number;
      };
    } = {};

    let currentDate = startDate;

    while (currentDate <= endDate) {
      const day = currentDate.format("dddd");

      aggregatedData[day] = {
        day,
        date: currentDate.format("YYYY-MM-DD"),
        totalAmount: 0,
        totalOrders: 0,
      };

      currentDate = currentDate.add(1, "day");
    }

    orders.forEach((order) => {
      const orderDate = dayjs(order.createdAt);
      const day = orderDate.format("dddd");

      // Only include orders within the date range
      if (orderDate.isAfter(startDate) && orderDate.isBefore(endDate)) {
        const amount = Number(order.totalAmount) || 0;
        if (aggregatedData[day] && !isNaN(amount)) {
          aggregatedData[day].totalAmount += amount;
          aggregatedData[day].totalOrders += 1;
        }
      }
    });

    return Object.values(aggregatedData).sort((a, b) =>
      dayjs(a.date).diff(dayjs(b.date)),
    );
  } catch (error: any) {
    console.error("Error retrieving orders chart", error);
    return null;
  }
}

import { OrderAttributes, Order } from "@/models/order.model";

export async function getOrders(): Promise<OrderAttributes[]> {
  try {
    return await Order.findAll();
  } catch (error: any) {
    console.error("Error fetching orders...", error);
    return [];
  }
}

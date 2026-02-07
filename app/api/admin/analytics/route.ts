import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { getOrders } from "@/lib/jespo/queries/orders";
import { getProducts } from "@/lib/jespo/queries/product";
import { getUsers } from "@/lib/jespo/queries/user";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (userRole?.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Get current data
    const [orders, products, users] = await Promise.all([
      getOrders(),
      getProducts({ category: null }),
      getUsers(),
    ]);

    // Calculate current metrics
    const currentMetrics = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalSales: orders.reduce((sum: number, order: any) => {
        const amount =
          typeof order.totalAmount === "string"
            ? parseFloat(order.totalAmount)
            : Number(order.totalAmount) || 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
    };

    // Calculate previous period metrics (last 30 days vs previous 30 days)
    const now = dayjs();
    const thirtyDaysAgo = now.subtract(30, "days");
    const sixtyDaysAgo = now.subtract(60, "days");

    // Filter orders for current period (last 30 days)
    const currentPeriodOrders = orders.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      return orderDate.isAfter(thirtyDaysAgo) && orderDate.isBefore(now);
    });

    // Filter orders for previous period (30-60 days ago)
    const previousPeriodOrders = orders.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      return (
        orderDate.isAfter(sixtyDaysAgo) && orderDate.isBefore(thirtyDaysAgo)
      );
    });

    // Calculate previous period metrics
    const previousMetrics = {
      totalProducts: Math.max(
        0,
        products.length - Math.floor(products.length * 0.1),
      ), // Estimate based on current
      totalOrders: previousPeriodOrders.length,
      totalUsers: Math.max(0, users.length - Math.floor(users.length * 0.1)), // Estimate based on current
      totalSales: previousPeriodOrders.reduce((sum: number, order: any) => {
        const amount =
          typeof order.totalAmount === "string"
            ? parseFloat(order.totalAmount)
            : Number(order.totalAmount) || 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
    };

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const percentageChanges = {
      products: calculatePercentageChange(
        currentMetrics.totalProducts,
        previousMetrics.totalProducts,
      ),
      orders: calculatePercentageChange(
        currentMetrics.totalOrders,
        previousMetrics.totalOrders,
      ),
      users: calculatePercentageChange(
        currentMetrics.totalUsers,
        previousMetrics.totalUsers,
      ),
      sales: calculatePercentageChange(
        currentMetrics.totalSales,
        previousMetrics.totalSales,
      ),
    };

    return NextResponse.json({
      current: currentMetrics,
      previous: previousMetrics,
      changes: percentageChanges,
    });
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}

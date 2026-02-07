import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { Order } from "@/models/order.model";
import { User } from "@/models/user.model";
import { emailService } from "@/lib/email/emailService";
import { randomUUID } from "crypto";

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const {
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status,
      paymentStatus,
      paymentReference,
    } = body;

    // Validate required fields
    if (!userId || !products || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const paymentIntentId = paymentReference;
    console.log(`payment intent ID: ${paymentIntentId}`);

    const orderData = {
      userId,
      amount: totalAmount,
      totalAmount: totalAmount,
      currency: "NGN",
      status: status || "pending",
      deliveryStatus: "pending",
      paymentIntentId,
      products: products,
      address: shippingAddress,
    };

    console.log("Creating order with data:", orderData);

    const orderId = await Order.create(orderData);

    // Send confirmation email
    try {
      const user = await User.findById(userId);
      if (user?.email) {
        const orderWithId = { ...orderData, id: orderId };
        await emailService.sendOrderConfirmationEmail(orderWithId, user.email);
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// GET /api/orders - Get orders for a user
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Filter orders by userId
    const allOrders = await Order.findAll();
    const userOrders = allOrders.filter((order) => order.userId === userId);

    return NextResponse.json({ orders: userOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

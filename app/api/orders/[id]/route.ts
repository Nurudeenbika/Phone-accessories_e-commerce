import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { Order } from "@/models/order.model";
import { User } from "@/models/user.model";
import { emailService } from "@/lib/email/emailService";
import { ExtendedUser } from "@/lib/types/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get specific order
export async function GET(request: NextRequest, { params }: RouteParams) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the current user (security check)
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Check authentication and admin role
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user as ExtendedUser)?.role?.toLowerCase() !== "admin"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, deliveryStatus } = body;

    console.log("Updating order:", { id, status, deliveryStatus });

    const updateData: { status?: string; deliveryStatus?: string } = {};
    if (status) updateData.status = status;
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;

    console.log("Update data:", updateData);

    const updated = await Order.update(id, updateData);

    console.log("Update result:", updated);

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send status update email if status changed
    if (status) {
      try {
        const order = await Order.findById(id);
        if (order) {
          const user = await User.findById(order.userId);
          if (user?.email) {
            await emailService.sendOrderStatusUpdateEmail(
              order,
              user.email,
              status,
            );
          }
        }
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}

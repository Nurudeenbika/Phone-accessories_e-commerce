import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { PaystackService } from "@/lib/paystack/service";
import { Order } from "@/models/order.model";
import { validatePaystackConfig } from "@/lib/paystack/config";

export async function POST(request: NextRequest) {
  try {
    // Validate Paystack configuration
    validatePaystackConfig();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reference } = body;

    // Validate required fields
    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 },
      );
    }

    // Verify the transaction with Paystack
    const verificationResponse =
      await PaystackService.verifyTransaction(reference);

    if (!verificationResponse.status) {
      return NextResponse.json(
        {
          error: verificationResponse.message || "Payment verification failed",
        },
        { status: 400 },
      );
    }

    const transactionData = verificationResponse.data;

    // Check if payment was successful
    if (transactionData.status !== "success") {
      return NextResponse.json({
        success: false,
        status: transactionData.status,
        message: transactionData.gateway_response || "Payment not successful",
        data: transactionData,
      });
    }

    // Extract order information from metadata
    const orderId = transactionData.metadata?.orderId;
    const userId = transactionData.metadata?.userId;

    if (!orderId || !userId) {
      return NextResponse.json(
        { error: "Invalid transaction metadata" },
        { status: 400 },
      );
    }

    // Verify the user owns this order
    if (userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access to order" },
        { status: 403 },
      );
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status to paid
    // Note: You might want to add an update method to your Order model
    // For now, we'll return the verification data and let the frontend handle the order update

    return NextResponse.json({
      success: true,
      status: transactionData.status,
      message: "Payment verified successfully",
      data: {
        transaction: transactionData,
        order: {
          id: order.id,
          amount: PaystackService.convertFromKobo(transactionData.amount),
          currency: transactionData.currency,
          status: "paid",
          paymentMethod: transactionData.channel,
          paidAt: transactionData.paid_at,
          reference: transactionData.reference,
        },
      },
    });
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}

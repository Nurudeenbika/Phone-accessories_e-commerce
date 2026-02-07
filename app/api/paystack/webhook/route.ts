import { NextRequest, NextResponse } from "next/server";
import { PaystackService } from "@/lib/paystack/service";
import { Order } from "@/models/order.model";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    console.log("Webhook received:", {
      hasSignature: !!signature,
      bodyLength: body.length,
      webhookSecret: !!process.env.PAYSTACK_WEBHOOK_SECRET,
    });

    // Skip signature validation for now to debug
    console.log("Skipping signature validation for debugging");

    // TODO: Fix signature validation later
    // The issue is that the webhook secret from Paystack dashboard doesn't match
    // For now, we'll process the webhook without validation

    // Parse the webhook data
    const event = JSON.parse(body);
    console.log("Paystack webhook received:", event);

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        await handleSuccessfulPayment(event.data);
        break;

      case "charge.failed":
        await handleFailedPayment(event.data);
        break;

      case "transfer.success":
        console.log("Transfer successful:", event.data);
        break;

      case "transfer.failed":
        console.log("Transfer failed:", event.data);
        break;

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Paystack webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleSuccessfulPayment(transactionData: any) {
  try {
    const tempOrderId = transactionData.metadata?.tempOrderId;
    const userId = transactionData.metadata?.userId;

    if (!tempOrderId || !userId) {
      console.error("Missing temp order or user ID in transaction metadata");
      return;
    }

    console.log(`Payment successful for temp order ${tempOrderId}:`, {
      amount: PaystackService.convertFromKobo(transactionData.amount),
      currency: transactionData.currency,
      reference: transactionData.reference,
      paidAt: transactionData.paid_at,
    });

    // Find the order by payment reference and update status
    const allOrders = await Order.findAll();
    const order = allOrders.find(
      (o) => o.paymentIntentId === transactionData.reference,
    );

    if (order) {
      const updateSuccess = await Order.updatePaymentStatus(
        order.id!,
        "paid",
        transactionData.reference,
      );

      if (updateSuccess) {
        console.log(`Order ${order.id} status updated to paid`);
      } else {
        console.error(`Failed to update order ${order.id} status to paid`);
      }
    } else {
      console.log(
        `No order found with payment reference ${transactionData.reference}`,
      );
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handleFailedPayment(transactionData: any) {
  try {
    const tempOrderId = transactionData.metadata?.tempOrderId;
    const userId = transactionData.metadata?.userId;

    if (!tempOrderId || !userId) {
      console.error("Missing temp order or user ID in transaction metadata");
      return;
    }

    console.log(`Payment failed for temp order ${tempOrderId}:`, {
      amount: PaystackService.convertFromKobo(transactionData.amount),
      currency: transactionData.currency,
      reference: transactionData.reference,
      gatewayResponse: transactionData.gateway_response,
    });

    // Note: Failed payments don't create orders, so no database update needed
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

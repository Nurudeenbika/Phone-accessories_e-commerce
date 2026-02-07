import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { PaystackService } from "@/lib/paystack/service";
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
    const { email, amount, orderId, customerInfo, callbackUrl } = body;

    // Validate required fields
    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: email, amount, orderId" },
        { status: 400 },
      );
    }

    // Validate amount (must be positive)
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    // Generate unique reference
    const reference = PaystackService.generateReference();

    // Convert amount to kobo (Paystack's smallest currency unit)
    const amountInKobo = PaystackService.convertToKobo(amount);

    // Prepare customer information
    const customer = customerInfo
      ? {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: email,
          phone: customerInfo.phone,
          metadata: {
            tempOrderId: orderId,
            userId: session.user?.id,
          },
        }
      : {
          email: email,
          metadata: {
            tempOrderId: orderId,
            userId: session.user?.id,
          },
        };

    // Initialize Paystack transaction
    const paystackResponse = await PaystackService.initializeTransaction({
      email: email,
      amount: amountInKobo,
      currency: "NGN",
      reference: reference,
      callback_url:
        callbackUrl || `${process.env.NEXTAUTH_URL}/checkout/success`,
      metadata: {
        tempOrderId: orderId,
        userId: session.user?.id,
        customerEmail: email,
      },
      customer: customer,
    });

    if (!paystackResponse.status) {
      return NextResponse.json(
        { error: paystackResponse.message || "Failed to initialize payment" },
        { status: 400 },
      );
    }

    // Return the authorization URL and reference
    return NextResponse.json({
      success: true,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
      message: "Payment initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing Paystack payment:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 },
    );
  }
}

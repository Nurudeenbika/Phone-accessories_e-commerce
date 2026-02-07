import Paystack from "paystack";

// Initialize Paystack with secret key
const paystack = Paystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  baseUrl: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET!,
};

export { paystack };

// Validate required environment variables
export function validatePaystackConfig() {
  const required = [
    "PAYSTACK_SECRET_KEY",
    "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
    "PAYSTACK_WEBHOOK_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Paystack environment variables: ${missing.join(", ")}`,
    );
  }
}

import { paystack, paystackConfig } from "./config";
import { OrderAttributes } from "@/models/order.model";

export interface PaystackInitializeRequest {
  email: string;
  amount: number; // Amount in kobo (smallest currency unit)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  customer?: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message?: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name?: string;
    };
    customer: {
      id: number;
      first_name?: string;
      last_name?: string;
      email: string;
      customer_code: string;
      phone?: string;
      metadata?: Record<string, any>;
      risk_action: string;
      international_format_phone?: string;
    };
    plan?: any;
    split: any;
    order_id?: string;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data?: any;
    source?: any;
    fees_breakdown?: any;
  };
}

export class PaystackService {
  /**
   * Initialize a Paystack transaction
   */
  static async initializeTransaction(
    request: PaystackInitializeRequest,
  ): Promise<PaystackInitializeResponse> {
    try {
      const response = await paystack.transaction.initialize({
        email: request.email,
        amount: request.amount,
        currency: request.currency || "NGN",
        reference: request.reference,
        callback_url: request.callback_url,
        metadata: request.metadata,
        channels: request.channels || [
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
        ],
        customer: request.customer,
      });

      return response;
    } catch (error: any) {
      console.error("Paystack initialization error:", error);
      if (error.response) {
        console.error("Paystack API Error:", error.response.data);
      }
      throw new Error("Failed to initialize payment");
    }
  }

  /**
   * Verify a Paystack transaction
   */
  static async verifyTransaction(
    reference: string,
  ): Promise<PaystackVerifyResponse> {
    try {
      const response = await paystack.transaction.verify(reference);
      return response;
    } catch (error) {
      console.error("Paystack verification error:", error);
      throw new Error("Failed to verify payment");
    }
  }

  /**
   * Create a customer on Paystack
   */
  static async createCustomer(customerData: {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const response = await paystack.customer.create(customerData);
      return response;
    } catch (error) {
      console.error("Paystack customer creation error:", error);
      throw new Error("Failed to create customer");
    }
  }

  /**
   * Get transaction details
   */
  static async getTransaction(transactionId: string) {
    try {
      const response = await paystack.transaction.fetch(transactionId);
      return response;
    } catch (error) {
      console.error("Paystack transaction fetch error:", error);
      throw new Error("Failed to fetch transaction");
    }
  }

  /**
   * List transactions
   */
  static async listTransactions(params?: {
    perPage?: number;
    page?: number;
    customer?: number;
    status?: string;
    from?: string;
    to?: string;
  }) {
    try {
      const response = await paystack.transaction.list(params);
      return response;
    } catch (error) {
      console.error("Paystack transaction list error:", error);
      throw new Error("Failed to list transactions");
    }
  }

  /**
   * Convert amount to kobo (Paystack's smallest currency unit)
   */
  static convertToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert amount from kobo to naira
   */
  static convertFromKobo(amount: number): number {
    return amount / 100;
  }

  /**
   * Generate a unique reference for transactions
   */
  static generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `JESPO_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Validate webhook signature
   */
  static validateWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", paystackConfig.webhookSecret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  }
}

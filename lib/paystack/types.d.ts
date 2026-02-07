declare module "paystack" {
  interface PaystackConfig {
    secretKey: string;
  }

  interface InitializeTransactionRequest {
    email: string;
    amount: number;
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
      metadata?: Record<string, any>;
    };
  }

  interface InitializeTransactionResponse {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }

  interface VerifyTransactionResponse {
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

  interface CreateCustomerRequest {
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }

  interface CreateCustomerResponse {
    status: boolean;
    message: string;
    data: {
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
  }

  interface TransactionListParams {
    perPage?: number;
    page?: number;
    customer?: number;
    status?: string;
    from?: string;
    to?: string;
  }

  interface TransactionListResponse {
    status: boolean;
    message: string;
    data: any[];
    meta: {
      total: number;
      skipped: number;
      perPage: number;
      page: number;
      pageCount: number;
    };
  }

  interface PaystackAPI {
    transaction: {
      initialize(
        request: InitializeTransactionRequest,
      ): Promise<InitializeTransactionResponse>;
      verify(reference: string): Promise<VerifyTransactionResponse>;
      fetch(transactionId: string): Promise<VerifyTransactionResponse>;
      list(params?: TransactionListParams): Promise<TransactionListResponse>;
    };
    customer: {
      create(request: CreateCustomerRequest): Promise<CreateCustomerResponse>;
    };
  }

  function Paystack(config: PaystackConfig): PaystackAPI;
  export = Paystack;
}


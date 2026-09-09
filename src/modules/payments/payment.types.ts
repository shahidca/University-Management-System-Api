import type {
  PaymentGateway,
  PaymentStatus,
} from "@prisma/client";

export interface PaymentInitiationResult {
  paymentId: string;
  transactionId: string;
  invoiceId: string;
  gateway: PaymentGateway;
  amount: string;
  currency: string;
  status: PaymentStatus;
  paymentUrl: string | null;
}

export interface PaymentStatusUpdateInput {
  status: PaymentStatus;
  gatewayTransactionId?: string;
  failureReason?: string;
  metadata?: Record<string, unknown>;
}

export interface SSLCommerzIpnPayload {
  status?: string;
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_brand?: string;
  risk_level?: string;
  risk_title?: string;
}
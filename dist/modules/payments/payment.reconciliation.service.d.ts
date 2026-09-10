import { InvoiceStatus, PaymentStatus } from "@prisma/client";
export interface PaymentReconciliationResult {
    paymentId: string;
    transactionId: string;
    localStatus: PaymentStatus;
    gatewayStatus: string | null;
    reconciled: boolean;
    changed: boolean;
    amount: string;
    currency: string;
    gatewayTransactionId: string | null;
    invoice: {
        id: string;
        status: InvoiceStatus;
        paidAmount: string;
        totalAmount: string;
    };
}
export declare const reconcilePayment: (paymentId: string) => Promise<PaymentReconciliationResult>;
//# sourceMappingURL=payment.reconciliation.service.d.ts.map
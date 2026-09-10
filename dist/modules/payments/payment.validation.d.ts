import { z } from "zod";
export declare const initiatePaymentSchema: z.ZodObject<{
    invoiceId: z.ZodString;
    gateway: z.ZodEnum<{
        BKASH: "BKASH";
        SSLCOMMERZ: "SSLCOMMERZ";
        STRIPE: "STRIPE";
    }>;
}, z.core.$strip>;
export declare const paymentIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const paymentListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    invoiceId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        FAILED: "FAILED";
        PENDING: "PENDING";
        PROCESSING: "PROCESSING";
        REFUNDED: "REFUNDED";
        SUCCESS: "SUCCESS";
    }>>;
    gateway: z.ZodOptional<z.ZodEnum<{
        BKASH: "BKASH";
        SSLCOMMERZ: "SSLCOMMERZ";
        STRIPE: "STRIPE";
    }>>;
    transactionId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        amount: "amount";
        completedAt: "completedAt";
        createdAt: "createdAt";
        initiatedAt: "initiatedAt";
        status: "status";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const paymentTransactionParamSchema: z.ZodObject<{
    transactionId: z.ZodString;
}, z.core.$strip>;
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type PaymentListQuery = z.infer<typeof paymentListQuerySchema>;
//# sourceMappingURL=payment.validation.d.ts.map
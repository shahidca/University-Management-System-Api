import { z } from "zod";
const uuidSchema = z
    .string()
    .uuid("Invalid ID");
export const initiatePaymentSchema = z.object({
    invoiceId: uuidSchema,
    gateway: z.enum([
        "STRIPE",
        "BKASH",
        "SSLCOMMERZ",
    ]),
});
export const paymentIdParamSchema = z.object({
    id: uuidSchema,
});
export const paymentListQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .positive()
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(20),
    invoiceId: uuidSchema.optional(),
    status: z
        .enum([
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
    ])
        .optional(),
    gateway: z
        .enum([
        "STRIPE",
        "BKASH",
        "SSLCOMMERZ",
    ])
        .optional(),
    transactionId: z
        .string()
        .trim()
        .max(100)
        .optional(),
    search: z
        .string()
        .trim()
        .max(100)
        .optional(),
    sortBy: z
        .enum([
        "createdAt",
        "initiatedAt",
        "completedAt",
        "amount",
        "status",
    ])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
export const paymentTransactionParamSchema = z.object({
    transactionId: z
        .string()
        .trim()
        .min(3, "Invalid transaction ID")
        .max(100),
});
//# sourceMappingURL=payment.validation.js.map
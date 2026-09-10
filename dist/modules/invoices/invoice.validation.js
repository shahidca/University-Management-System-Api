import { z } from "zod";
const uuidSchema = z
    .string()
    .uuid("Invalid ID");
const moneySchema = z
    .coerce
    .number()
    .finite()
    .nonnegative("Amount cannot be negative")
    .refine((value) => Number.isInteger(value * 100), "Amount can have at most 2 decimal places");
const positiveMoneySchema = z
    .coerce
    .number()
    .finite()
    .positive("Amount must be greater than zero")
    .refine((value) => Number.isInteger(value * 100), "Amount can have at most 2 decimal places");
const invoiceItemSchema = z.object({
    feeId: uuidSchema,
    description: z
        .string()
        .trim()
        .max(500, "Item description must not exceed 500 characters")
        .optional(),
    quantity: z
        .coerce
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be greater than zero")
        .max(1000, "Quantity must not exceed 1000"),
});
export const createInvoiceSchema = z.object({
    studentId: uuidSchema,
    dueDate: z.coerce.date(),
    discount: moneySchema.optional(),
    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),
    items: z
        .array(invoiceItemSchema)
        .min(1, "At least one invoice item is required")
        .max(100, "An invoice cannot contain more than 100 items"),
});
export const updateInvoiceSchema = z
    .object({
    dueDate: z.coerce.date().optional(),
    discount: moneySchema.optional(),
    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, "At least one field is required for update");
export const invoiceIdParamSchema = z.object({
    id: uuidSchema,
});
export const invoiceListQuerySchema = z.object({
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
    studentId: uuidSchema.optional(),
    status: z
        .enum([
        "UNPAID",
        "PARTIALLY_PAID",
        "PAID",
        "OVERDUE",
        "CANCELLED",
    ])
        .optional(),
    search: z
        .string()
        .trim()
        .max(100)
        .optional(),
    sortBy: z
        .enum([
        "invoiceNumber",
        "totalAmount",
        "dueDate",
        "status",
        "issuedAt",
        "paidAt",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});
//# sourceMappingURL=invoice.validation.js.map
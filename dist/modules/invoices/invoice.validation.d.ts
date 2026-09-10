import { z } from "zod";
export declare const createInvoiceSchema: z.ZodObject<{
    studentId: z.ZodString;
    dueDate: z.ZodCoercedDate<unknown>;
    discount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    description: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        feeId: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateInvoiceSchema: z.ZodObject<{
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    discount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const invoiceIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const invoiceListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    studentId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        OVERDUE: "OVERDUE";
        PAID: "PAID";
        PARTIALLY_PAID: "PARTIALLY_PAID";
        UNPAID: "UNPAID";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        dueDate: "dueDate";
        invoiceNumber: "invoiceNumber";
        issuedAt: "issuedAt";
        paidAt: "paidAt";
        status: "status";
        totalAmount: "totalAmount";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type InvoiceListQuery = z.infer<typeof invoiceListQuerySchema>;
//# sourceMappingURL=invoice.validation.d.ts.map
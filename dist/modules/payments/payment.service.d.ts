import { Prisma } from "@prisma/client";
import type { InitiatePaymentInput, PaymentListQuery } from "./payment.validation.js";
import type { PaymentInitiationResult } from "./payment.types.js";
export declare const initiatePayment: (input: InitiatePaymentInput, actorId: string) => Promise<PaymentInitiationResult>;
export declare const getPayments: (query: PaymentListQuery) => Promise<{
    payments: {
        amount: Prisma.Decimal;
        completedAt: Date | null;
        createdAt: Date;
        currency: string;
        failedAt: Date | null;
        failureReason: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway;
        gatewayTransactionId: string | null;
        id: string;
        initiatedAt: Date;
        invoice: {
            discount: Prisma.Decimal;
            dueDate: Date;
            id: string;
            invoiceNumber: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            student: {
                firstName: string;
                id: string;
                lastName: string;
                studentId: string;
                user: {
                    email: string;
                    id: string;
                };
            };
            subtotal: Prisma.Decimal;
            totalAmount: Prisma.Decimal;
        };
        invoiceId: string;
        metadata: Prisma.JsonValue;
        paymentUrl: string | null;
        status: import("@prisma/client").$Enums.PaymentStatus;
        transactionId: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}>;
export declare const getPaymentById: (id: string) => Promise<{
    amount: Prisma.Decimal;
    completedAt: Date | null;
    createdAt: Date;
    currency: string;
    failedAt: Date | null;
    failureReason: string | null;
    gateway: import("@prisma/client").$Enums.PaymentGateway;
    gatewayTransactionId: string | null;
    id: string;
    initiatedAt: Date;
    invoice: {
        discount: Prisma.Decimal;
        dueDate: Date;
        id: string;
        invoiceNumber: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            studentId: string;
            user: {
                email: string;
                id: string;
            };
        };
        subtotal: Prisma.Decimal;
        totalAmount: Prisma.Decimal;
    };
    invoiceId: string;
    metadata: Prisma.JsonValue;
    paymentUrl: string | null;
    status: import("@prisma/client").$Enums.PaymentStatus;
    transactionId: string;
    updatedAt: Date;
}>;
export declare const getPaymentByTransactionId: (transactionId: string) => Promise<{
    amount: Prisma.Decimal;
    completedAt: Date | null;
    createdAt: Date;
    currency: string;
    failedAt: Date | null;
    failureReason: string | null;
    gateway: import("@prisma/client").$Enums.PaymentGateway;
    gatewayTransactionId: string | null;
    id: string;
    initiatedAt: Date;
    invoice: {
        discount: Prisma.Decimal;
        dueDate: Date;
        id: string;
        invoiceNumber: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            studentId: string;
            user: {
                email: string;
                id: string;
            };
        };
        subtotal: Prisma.Decimal;
        totalAmount: Prisma.Decimal;
    };
    invoiceId: string;
    metadata: Prisma.JsonValue;
    paymentUrl: string | null;
    status: import("@prisma/client").$Enums.PaymentStatus;
    transactionId: string;
    updatedAt: Date;
}>;
//# sourceMappingURL=payment.service.d.ts.map
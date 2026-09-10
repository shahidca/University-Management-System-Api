import { Prisma } from "@prisma/client";
import type { CreateInvoiceInput, InvoiceListQuery, UpdateInvoiceInput } from "./invoice.validation.js";
export declare const createInvoice: (input: CreateInvoiceInput) => Promise<{
    createdAt: Date;
    description: string | null;
    discount: Prisma.Decimal;
    dueDate: Date;
    id: string;
    invoiceNumber: string;
    issuedAt: Date;
    items: {
        createdAt: Date;
        description: string | null;
        fee: {
            code: string;
            id: string;
            name: string;
        };
        feeId: string;
        id: string;
        invoiceId: string;
        quantity: number;
        totalAmount: Prisma.Decimal;
        unitAmount: Prisma.Decimal;
        updatedAt: Date;
    }[];
    paidAt: Date | null;
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
    studentId: string;
    subtotal: Prisma.Decimal;
    totalAmount: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const getInvoices: (query: InvoiceListQuery) => Promise<{
    invoices: {
        createdAt: Date;
        description: string | null;
        discount: Prisma.Decimal;
        dueDate: Date;
        id: string;
        invoiceNumber: string;
        issuedAt: Date;
        items: {
            createdAt: Date;
            description: string | null;
            fee: {
                code: string;
                id: string;
                name: string;
            };
            feeId: string;
            id: string;
            invoiceId: string;
            quantity: number;
            totalAmount: Prisma.Decimal;
            unitAmount: Prisma.Decimal;
            updatedAt: Date;
        }[];
        paidAt: Date | null;
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
        studentId: string;
        subtotal: Prisma.Decimal;
        totalAmount: Prisma.Decimal;
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
export declare const getInvoiceById: (id: string) => Promise<{
    createdAt: Date;
    description: string | null;
    discount: Prisma.Decimal;
    dueDate: Date;
    id: string;
    invoiceNumber: string;
    issuedAt: Date;
    items: {
        createdAt: Date;
        description: string | null;
        fee: {
            code: string;
            id: string;
            name: string;
        };
        feeId: string;
        id: string;
        invoiceId: string;
        quantity: number;
        totalAmount: Prisma.Decimal;
        unitAmount: Prisma.Decimal;
        updatedAt: Date;
    }[];
    paidAt: Date | null;
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
    studentId: string;
    subtotal: Prisma.Decimal;
    totalAmount: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const updateInvoice: (id: string, input: UpdateInvoiceInput) => Promise<{
    createdAt: Date;
    description: string | null;
    discount: Prisma.Decimal;
    dueDate: Date;
    id: string;
    invoiceNumber: string;
    issuedAt: Date;
    items: {
        createdAt: Date;
        description: string | null;
        fee: {
            code: string;
            id: string;
            name: string;
        };
        feeId: string;
        id: string;
        invoiceId: string;
        quantity: number;
        totalAmount: Prisma.Decimal;
        unitAmount: Prisma.Decimal;
        updatedAt: Date;
    }[];
    paidAt: Date | null;
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
    studentId: string;
    subtotal: Prisma.Decimal;
    totalAmount: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const cancelInvoice: (id: string) => Promise<{
    createdAt: Date;
    description: string | null;
    discount: Prisma.Decimal;
    dueDate: Date;
    id: string;
    invoiceNumber: string;
    issuedAt: Date;
    items: {
        createdAt: Date;
        description: string | null;
        fee: {
            code: string;
            id: string;
            name: string;
        };
        feeId: string;
        id: string;
        invoiceId: string;
        quantity: number;
        totalAmount: Prisma.Decimal;
        unitAmount: Prisma.Decimal;
        updatedAt: Date;
    }[];
    paidAt: Date | null;
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
    studentId: string;
    subtotal: Prisma.Decimal;
    totalAmount: Prisma.Decimal;
    updatedAt: Date;
}>;
//# sourceMappingURL=invoice.service.d.ts.map
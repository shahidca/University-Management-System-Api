import { Prisma } from "@prisma/client";
import type { CreateFeeInput, FeeListQuery, UpdateFeeInput } from "./fee.validation.js";
export declare const createFee: (input: CreateFeeInput) => Promise<{
    amount: Prisma.Decimal;
    code: string;
    createdAt: Date;
    description: string | null;
    id: string;
    isActive: boolean;
    name: string;
    updatedAt: Date;
}>;
export declare const getFees: (query: FeeListQuery) => Promise<{
    fees: {
        amount: Prisma.Decimal;
        code: string;
        createdAt: Date;
        description: string | null;
        id: string;
        isActive: boolean;
        name: string;
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
export declare const getFeeById: (id: string) => Promise<{
    amount: Prisma.Decimal;
    code: string;
    createdAt: Date;
    description: string | null;
    id: string;
    isActive: boolean;
    name: string;
    updatedAt: Date;
}>;
export declare const updateFee: (id: string, input: UpdateFeeInput) => Promise<{
    amount: Prisma.Decimal;
    code: string;
    createdAt: Date;
    description: string | null;
    id: string;
    isActive: boolean;
    name: string;
    updatedAt: Date;
}>;
export declare const deleteFee: (id: string) => Promise<void>;
//# sourceMappingURL=fee.service.d.ts.map
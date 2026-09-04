import { Prisma } from "@prisma/client";
import type { CreateProgramInput, ProgramListQueryInput, UpdateProgramInput } from "./program.validation.js";
export declare const createProgram: (input: CreateProgramInput) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    name: string;
    degree: string;
    durationYears: number;
    totalCredits: Prisma.Decimal;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getPrograms: (query: ProgramListQueryInput) => Promise<{
    items: ({
        department: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            isActive: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        code: string;
        name: string;
        degree: string;
        durationYears: number;
        totalCredits: Prisma.Decimal;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getProgramById: (id: string) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    name: string;
    degree: string;
    durationYears: number;
    totalCredits: Prisma.Decimal;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateProgram: (id: string, input: UpdateProgramInput) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    name: string;
    degree: string;
    durationYears: number;
    totalCredits: Prisma.Decimal;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteProgram: (id: string) => Promise<void>;
//# sourceMappingURL=program.service.d.ts.map
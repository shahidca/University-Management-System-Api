import type { CreateDepartmentInput, DepartmentListQuery, UpdateDepartmentInput } from "./department.validation.js";
export declare const createDepartment: (input: CreateDepartmentInput) => Promise<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getDepartments: (query: DepartmentListQuery) => Promise<{
    departments: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getDepartmentById: (id: string) => Promise<{
    programs: {
        id: string;
        departmentId: string;
        code: string;
        name: string;
        degree: string;
        durationYears: number;
        totalCredits: import("@prisma/client-runtime-utils").Decimal;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
} & {
    id: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateDepartment: (id: string, input: UpdateDepartmentInput) => Promise<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteDepartment: (id: string) => Promise<void>;
//# sourceMappingURL=department.service.d.ts.map
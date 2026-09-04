import type { AcademicYearListQueryInput, CreateAcademicYearInput, UpdateAcademicYearInput } from "./academic-year.validation.js";
export declare const createAcademicYear: (input: CreateAcademicYearInput) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getAcademicYears: (query: AcademicYearListQueryInput) => Promise<{
    items: ({
        _count: {
            semesters: number;
        };
    } & {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
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
export declare const getAcademicYearById: (id: string) => Promise<{
    semesters: {
        id: string;
        academicYearId: string;
        name: string;
        code: string;
        type: import("@prisma/client").$Enums.SemesterType;
        status: import("@prisma/client").$Enums.SemesterStatus;
        startDate: Date;
        endDate: Date;
        registrationOpen: Date;
        registrationClose: Date;
        createdAt: Date;
        updatedAt: Date;
    }[];
} & {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateAcademicYear: (id: string, input: UpdateAcademicYearInput) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const activateAcademicYear: (id: string) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deactivateAcademicYear: (id: string) => Promise<{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=academic-year.service.d.ts.map
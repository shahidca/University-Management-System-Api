import { Prisma } from "@prisma/client";
import type { CreateSemesterInput, SemesterListQueryInput, UpdateSemesterInput } from "./semester.validation.js";
export declare const createSemester: (input: CreateSemesterInput) => Promise<{
    academicYear: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
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
}>;
export declare const getSemesters: (query: SemesterListQueryInput) => Promise<{
    items: ({
        _count: {
            courseOfferings: number;
            transcripts: number;
        };
        academicYear: {
            id: string;
            name: string;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getSemesterById: (id: string) => Promise<{
    _count: {
        transcripts: number;
    };
    academicYear: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    courseOfferings: {
        id: string;
        courseId: string;
        semesterId: string;
        code: string;
        title: string;
        credits: Prisma.Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
} & {
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
}>;
export declare const updateSemester: (id: string, input: UpdateSemesterInput) => Promise<{
    academicYear: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
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
}>;
export declare const openSemesterRegistration: (id: string) => Promise<{
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
}>;
export declare const closeSemesterRegistration: (id: string) => Promise<{
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
}>;
export declare const activateSemester: (id: string) => Promise<{
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
}>;
export declare const completeSemester: (id: string) => Promise<{
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
}>;
//# sourceMappingURL=semester.service.d.ts.map
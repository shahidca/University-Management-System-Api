import { Prisma } from "@prisma/client";
import type { CreateEnrollmentInput, EnrollmentListQueryInput } from "./enrollment.validation.js";
export declare const createEnrollment: (userId: string, input: CreateEnrollmentInput) => Promise<{
    createdAt: Date;
    droppedAt: Date | null;
    enrolledAt: Date | null;
    id: string;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                credits: Prisma.Decimal;
                id: string;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    updatedAt: Date;
}>;
export declare const getEnrollments: (query: EnrollmentListQueryInput) => Promise<{
    items: {
        createdAt: Date;
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            capacity: number;
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    credits: Prisma.Decimal;
                    id: string;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                isActive: boolean;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    registrationClose: Date;
                    registrationOpen: Date;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            enrolledCount: number;
            id: string;
            isActive: boolean;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getEnrollmentById: (id: string) => Promise<{
    createdAt: Date;
    droppedAt: Date | null;
    enrolledAt: Date | null;
    id: string;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                credits: Prisma.Decimal;
                id: string;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    updatedAt: Date;
}>;
export declare const dropEnrollment: (userId: string, id: string) => Promise<{
    droppedAt: Date | null;
    enrolledAt: Date | null;
    id: string;
    sectionId: string;
    status: import("@prisma/client").$Enums.EnrollmentStatus;
    studentId: string;
}>;
export declare const getMyEnrollments: (userId: string, query: EnrollmentListQueryInput) => Promise<{
    items: {
        createdAt: Date;
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            capacity: number;
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    credits: Prisma.Decimal;
                    id: string;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                isActive: boolean;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    registrationClose: Date;
                    registrationOpen: Date;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            enrolledCount: number;
            id: string;
            isActive: boolean;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=enrollment.service.d.ts.map
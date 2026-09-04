import type { CreateStudentProfileInput, UpdateStudentProfileInput } from "./student.validation.js";
export declare const createStudentProfile: (userId: string, input: CreateStudentProfileInput) => Promise<{
    program: {
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
    };
} & {
    id: string;
    userId: string;
    programId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    phone: string | null;
    address: string | null;
    admissionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const getStudentProfile: (userId: string) => Promise<{
    program: {
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
    };
} & {
    id: string;
    userId: string;
    programId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    phone: string | null;
    address: string | null;
    admissionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateStudentProfile: (userId: string, input: UpdateStudentProfileInput) => Promise<{
    program: {
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
    };
} & {
    id: string;
    userId: string;
    programId: string;
    studentId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    phone: string | null;
    address: string | null;
    admissionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=student.service.d.ts.map
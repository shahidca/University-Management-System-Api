import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";
import type { TranscriptListQueryInput } from "./transcript.validation.js";
/**
 * ---------------------------------------------------------
 * GENERATE SEMESTER TRANSCRIPT
 * ---------------------------------------------------------
 */
export declare const generateSemesterTranscript: (userId: string, semesterId: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}>;
/**
 * ---------------------------------------------------------
 * GET TRANSCRIPT BY ID
 * ---------------------------------------------------------
 */
export declare const getTranscriptById: (userId: string, role: Role, id: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}>;
/**
 * ---------------------------------------------------------
 * GET TRANSCRIPTS
 * ---------------------------------------------------------
 */
export declare const getTranscripts: (userId: string, role: Role, query: TranscriptListQueryInput) => Promise<{
    items: {
        approvedAt: Date | null;
        createdAt: Date;
        cumulativeGpa: Prisma.Decimal | null;
        id: string;
        issuedAt: Date | null;
        semester: {
            code: string;
            endDate: Date;
            id: string;
            name: string;
            startDate: Date;
            status: import("@prisma/client").$Enums.SemesterStatus;
            type: import("@prisma/client").$Enums.SemesterType;
        } | null;
        semesterGpa: Prisma.Decimal | null;
        semesterId: string | null;
        status: import("@prisma/client").$Enums.TranscriptStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
        totalCredits: Prisma.Decimal | null;
        transcriptNo: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
/**
 * ---------------------------------------------------------
 * APPROVE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * GENERATED → APPROVED
 *
 * The transcript update and AuditLog creation happen
 * inside the SAME transaction.
 */
export declare const approveTranscript: (id: string, actorId: string, ipAddress?: string, userAgent?: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}>;
/**
 * ---------------------------------------------------------
 * ISSUE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * APPROVED → ISSUED
 *
 * IMPORTANT:
 * The transcript state change and AuditLog are committed
 * first. The student notification happens AFTER the
 * transaction succeeds.
 *
 * Notification failure must never roll back an issued
 * transcript.
 */
export declare const issueTranscript: (id: string, actorId: string, ipAddress?: string, userAgent?: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}>;
/**
 * ---------------------------------------------------------
 * GET MY ISSUED TRANSCRIPTS
 * ---------------------------------------------------------
 */
export declare const getMyIssuedTranscripts: (userId: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}[]>;
/**
 * ---------------------------------------------------------
 * REVOKE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * ISSUED → REVOKED
 */
export declare const revokeTranscript: (id: string, actorId: string, ipAddress?: string, userAgent?: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    cumulativeGpa: Prisma.Decimal | null;
    id: string;
    issuedAt: Date | null;
    semester: {
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
        type: import("@prisma/client").$Enums.SemesterType;
    } | null;
    semesterGpa: Prisma.Decimal | null;
    semesterId: string | null;
    status: import("@prisma/client").$Enums.TranscriptStatus;
    student: {
        firstName: string;
        id: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
        studentId: string;
    };
    studentId: string;
    totalCredits: Prisma.Decimal | null;
    transcriptNo: string;
    updatedAt: Date;
}>;
/**
 * ---------------------------------------------------------
 * GET STUDENT TRANSCRIPTS
 * ---------------------------------------------------------
 *
 * ADMIN ONLY
 */
export declare const getStudentTranscripts: (studentId: string, query: TranscriptListQueryInput) => Promise<{
    student: {
        firstName: string;
        id: string;
        lastName: string;
        studentId: string;
    };
    items: {
        approvedAt: Date | null;
        createdAt: Date;
        cumulativeGpa: Prisma.Decimal | null;
        id: string;
        issuedAt: Date | null;
        semester: {
            code: string;
            endDate: Date;
            id: string;
            name: string;
            startDate: Date;
            status: import("@prisma/client").$Enums.SemesterStatus;
            type: import("@prisma/client").$Enums.SemesterType;
        } | null;
        semesterGpa: Prisma.Decimal | null;
        semesterId: string | null;
        status: import("@prisma/client").$Enums.TranscriptStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
        totalCredits: Prisma.Decimal | null;
        transcriptNo: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
//# sourceMappingURL=transcript.service.d.ts.map
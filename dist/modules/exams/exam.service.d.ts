import { Prisma } from "@prisma/client";
import type { CreateExamInput, ExamListQueryInput, UpdateExamInput } from "./exam.validation.js";
export declare const createExam: (userId: string, input: CreateExamInput) => Promise<{
    createdAt: Date;
    description: string | null;
    endTime: string | null;
    examDate: Date;
    examType: import("@prisma/client").$Enums.ExamType;
    id: string;
    isPublished: boolean;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                courseType: import("@prisma/client").$Enums.CourseType;
                credits: Prisma.Decimal;
                deletedAt: Date | null;
                id: string;
                isActive: boolean;
                level: number;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                endDate: Date;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                startDate: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
                type: import("@prisma/client").$Enums.SemesterType;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    startTime: string | null;
    title: string;
    totalMarks: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const getExamById: (examId: string) => Promise<{
    createdAt: Date;
    description: string | null;
    endTime: string | null;
    examDate: Date;
    examType: import("@prisma/client").$Enums.ExamType;
    id: string;
    isPublished: boolean;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                courseType: import("@prisma/client").$Enums.CourseType;
                credits: Prisma.Decimal;
                deletedAt: Date | null;
                id: string;
                isActive: boolean;
                level: number;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                endDate: Date;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                startDate: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
                type: import("@prisma/client").$Enums.SemesterType;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    startTime: string | null;
    title: string;
    totalMarks: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const getExams: (query: ExamListQueryInput) => Promise<{
    items: {
        createdAt: Date;
        description: string | null;
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            capacity: number;
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    deletedAt: Date | null;
                    id: string;
                    isActive: boolean;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                isActive: boolean;
                semester: {
                    code: string;
                    endDate: Date;
                    id: string;
                    name: string;
                    registrationClose: Date;
                    registrationOpen: Date;
                    startDate: Date;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                    type: import("@prisma/client").$Enums.SemesterType;
                };
                title: string;
            };
            enrolledCount: number;
            id: string;
            instructor: {
                designation: string | null;
                employeeId: string;
                firstName: string;
                id: string;
                isActive: boolean;
                lastName: string;
                userId: string;
            };
            isActive: boolean;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const updateExam: (userId: string, examId: string, input: UpdateExamInput) => Promise<{
    createdAt: Date;
    description: string | null;
    endTime: string | null;
    examDate: Date;
    examType: import("@prisma/client").$Enums.ExamType;
    id: string;
    isPublished: boolean;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                courseType: import("@prisma/client").$Enums.CourseType;
                credits: Prisma.Decimal;
                deletedAt: Date | null;
                id: string;
                isActive: boolean;
                level: number;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                endDate: Date;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                startDate: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
                type: import("@prisma/client").$Enums.SemesterType;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    startTime: string | null;
    title: string;
    totalMarks: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const publishExam: (userId: string, examId: string) => Promise<{
    createdAt: Date;
    description: string | null;
    endTime: string | null;
    examDate: Date;
    examType: import("@prisma/client").$Enums.ExamType;
    id: string;
    isPublished: boolean;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                courseType: import("@prisma/client").$Enums.CourseType;
                credits: Prisma.Decimal;
                deletedAt: Date | null;
                id: string;
                isActive: boolean;
                level: number;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                endDate: Date;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                startDate: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
                type: import("@prisma/client").$Enums.SemesterType;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    startTime: string | null;
    title: string;
    totalMarks: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const unpublishExam: (userId: string, examId: string) => Promise<{
    createdAt: Date;
    description: string | null;
    endTime: string | null;
    examDate: Date;
    examType: import("@prisma/client").$Enums.ExamType;
    id: string;
    isPublished: boolean;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
                courseType: import("@prisma/client").$Enums.CourseType;
                credits: Prisma.Decimal;
                deletedAt: Date | null;
                id: string;
                isActive: boolean;
                level: number;
                title: string;
            };
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semester: {
                code: string;
                endDate: Date;
                id: string;
                name: string;
                registrationClose: Date;
                registrationOpen: Date;
                startDate: Date;
                status: import("@prisma/client").$Enums.SemesterStatus;
                type: import("@prisma/client").$Enums.SemesterType;
            };
            title: string;
        };
        enrolledCount: number;
        id: string;
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
        isActive: boolean;
        name: string;
        sectionCode: string;
    };
    sectionId: string;
    startTime: string | null;
    title: string;
    totalMarks: Prisma.Decimal;
    updatedAt: Date;
}>;
export declare const deleteExam: (userId: string, examId: string) => Promise<{
    id: string;
}>;
//# sourceMappingURL=exam.service.d.ts.map
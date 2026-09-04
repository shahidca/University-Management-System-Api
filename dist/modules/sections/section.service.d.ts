import { Prisma } from "@prisma/client";
import type { CreateSectionInput, SectionListQueryInput, UpdateSectionInput } from "./section.validation.js";
export declare const createSection: (input: CreateSectionInput) => Promise<{
    id: string;
    courseOfferingId: string;
    instructorId: string;
    sectionCode: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    semester: {
        academicYearId: string;
        code: string;
        endDate: Date;
        id: string;
        name: string;
        startDate: Date;
        status: import("@prisma/client").$Enums.SemesterStatus;
    };
    instructor: {
        designation: string | null;
        employeeId: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        userId: string;
    };
    _count: {
        enrollments: number;
        exams: number;
        schedules: number;
    };
    courseOffering: {
        code: string;
        courseId: string;
        credits: Prisma.Decimal;
        id: string;
        isActive: boolean;
        semesterId: string;
        title: string;
    };
}>;
export declare const getSections: (query: SectionListQueryInput) => Promise<{
    items: ({
        _count: {
            enrollments: number;
            exams: number;
            schedules: number;
        };
        courseOffering: {
            code: string;
            courseId: string;
            credits: Prisma.Decimal;
            id: string;
            isActive: boolean;
            semesterId: string;
            title: string;
        };
        instructor: {
            designation: string | null;
            employeeId: string;
            firstName: string;
            id: string;
            isActive: boolean;
            lastName: string;
            userId: string;
        };
    } & {
        id: string;
        courseOfferingId: string;
        instructorId: string;
        sectionCode: string;
        name: string;
        capacity: number;
        enrolledCount: number;
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
export declare const getSectionById: (id: string) => Promise<{
    _count: {
        enrollments: number;
        exams: number;
        schedules: number;
    };
    courseOffering: {
        course: {
            code: string;
            courseType: import("@prisma/client").$Enums.CourseType;
            credits: Prisma.Decimal;
            id: string;
            level: number;
            title: string;
        };
        semester: {
            academicYearId: string;
            code: string;
            endDate: Date;
            id: string;
            name: string;
            startDate: Date;
            status: import("@prisma/client").$Enums.SemesterStatus;
            type: import("@prisma/client").$Enums.SemesterType;
        };
    } & {
        id: string;
        courseId: string;
        semesterId: string;
        code: string;
        title: string;
        credits: Prisma.Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    instructor: {
        designation: string | null;
        employeeId: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        userId: string;
    };
} & {
    id: string;
    courseOfferingId: string;
    instructorId: string;
    sectionCode: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateSection: (id: string, input: UpdateSectionInput) => Promise<{
    _count: {
        enrollments: number;
        exams: number;
        schedules: number;
    };
    courseOffering: {
        code: string;
        courseId: string;
        credits: Prisma.Decimal;
        id: string;
        isActive: boolean;
        semesterId: string;
        title: string;
    };
    instructor: {
        designation: string | null;
        employeeId: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        userId: string;
    };
} & {
    id: string;
    courseOfferingId: string;
    instructorId: string;
    sectionCode: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const activateSection: (id: string) => Promise<{
    courseOffering: {
        code: string;
        courseId: string;
        credits: Prisma.Decimal;
        id: string;
        isActive: boolean;
        semesterId: string;
        title: string;
    };
    instructor: {
        designation: string | null;
        employeeId: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        userId: string;
    };
} & {
    id: string;
    courseOfferingId: string;
    instructorId: string;
    sectionCode: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deactivateSection: (id: string) => Promise<{
    courseOffering: {
        code: string;
        courseId: string;
        credits: Prisma.Decimal;
        id: string;
        isActive: boolean;
        semesterId: string;
        title: string;
    };
    instructor: {
        designation: string | null;
        employeeId: string;
        firstName: string;
        id: string;
        isActive: boolean;
        lastName: string;
        userId: string;
    };
} & {
    id: string;
    courseOfferingId: string;
    instructorId: string;
    sectionCode: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteSection: (id: string) => Promise<void>;
//# sourceMappingURL=section.service.d.ts.map
import { Prisma } from "@prisma/client";
import type { CreateCourseOfferingInput, CourseOfferingListQueryInput, UpdateCourseOfferingInput } from "./course-offering.validation.js";
export declare const createCourseOffering: (input: CreateCourseOfferingInput) => Promise<{
    _count: {
        sections: number;
    };
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
    semester: {
        academicYearId: string;
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
}>;
export declare const getCourseOfferings: (query: CourseOfferingListQueryInput) => Promise<{
    items: ({
        _count: {
            sections: number;
        };
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
        semester: {
            academicYearId: string;
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
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getCourseOfferingById: (id: string) => Promise<{
    _count: {
        sections: number;
    };
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
    sections: {
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
    }[];
    semester: {
        academicYearId: string;
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
}>;
export declare const updateCourseOffering: (id: string, input: UpdateCourseOfferingInput) => Promise<{
    _count: {
        sections: number;
    };
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
    semester: {
        academicYearId: string;
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
}>;
export declare const activateCourseOffering: (id: string) => Promise<{
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
    semester: {
        academicYearId: string;
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
}>;
export declare const deactivateCourseOffering: (id: string) => Promise<{
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
    semester: {
        academicYearId: string;
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
}>;
export declare const deleteCourseOffering: (id: string) => Promise<void>;
//# sourceMappingURL=course-offering.service.d.ts.map
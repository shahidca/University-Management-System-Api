import { Prisma } from "@prisma/client";
import type { CreateCoursePrerequisiteInput, PrerequisiteListQueryInput, UpdateCoursePrerequisiteInput } from "./course-prerequisite.validation.js";
export declare const createCoursePrerequisite: (input: CreateCoursePrerequisiteInput) => Promise<{
    id: string;
    courseId: string;
    prerequisiteId: string;
    minimumGrade: string | null;
    createdAt: Date;
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
    prerequisite: {
        code: string;
        courseType: import("@prisma/client").$Enums.CourseType;
        credits: Prisma.Decimal;
        deletedAt: Date | null;
        id: string;
        isActive: boolean;
        level: number;
        title: string;
    };
}>;
export declare const getCoursePrerequisites: (query: PrerequisiteListQueryInput) => Promise<{
    items: ({
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
        prerequisite: {
            code: string;
            courseType: import("@prisma/client").$Enums.CourseType;
            credits: Prisma.Decimal;
            deletedAt: Date | null;
            id: string;
            isActive: boolean;
            level: number;
            title: string;
        };
    } & {
        id: string;
        courseId: string;
        prerequisiteId: string;
        minimumGrade: string | null;
        createdAt: Date;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getCoursePrerequisiteById: (id: string) => Promise<{
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
    prerequisite: {
        code: string;
        courseType: import("@prisma/client").$Enums.CourseType;
        credits: Prisma.Decimal;
        deletedAt: Date | null;
        id: string;
        isActive: boolean;
        level: number;
        title: string;
    };
} & {
    id: string;
    courseId: string;
    prerequisiteId: string;
    minimumGrade: string | null;
    createdAt: Date;
}>;
export declare const updateCoursePrerequisite: (id: string, input: UpdateCoursePrerequisiteInput) => Promise<{
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
    prerequisite: {
        code: string;
        courseType: import("@prisma/client").$Enums.CourseType;
        credits: Prisma.Decimal;
        deletedAt: Date | null;
        id: string;
        isActive: boolean;
        level: number;
        title: string;
    };
} & {
    id: string;
    courseId: string;
    prerequisiteId: string;
    minimumGrade: string | null;
    createdAt: Date;
}>;
export declare const deleteCoursePrerequisite: (id: string) => Promise<void>;
//# sourceMappingURL=course-prerequisite.service.d.ts.map
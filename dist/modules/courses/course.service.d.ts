import { Prisma } from "@prisma/client";
import type { CourseListQueryInput, CreateCourseInput, UpdateCourseInput } from "./course.validation.js";
export declare const createCourse: (input: CreateCourseInput) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    title: string;
    description: string | null;
    credits: Prisma.Decimal;
    courseType: import("@prisma/client").$Enums.CourseType;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const getCourses: (query: CourseListQueryInput) => Promise<{
    items: ({
        _count: {
            offerings: number;
            prerequisiteFor: number;
            prerequisites: number;
        };
        department: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            isActive: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        departmentId: string;
        code: string;
        title: string;
        description: string | null;
        credits: Prisma.Decimal;
        courseType: import("@prisma/client").$Enums.CourseType;
        level: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getCourseById: (id: string) => Promise<{
    _count: {
        offerings: number;
    };
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
    prerequisiteFor: ({
        course: {
            id: string;
            departmentId: string;
            code: string;
            title: string;
            description: string | null;
            credits: Prisma.Decimal;
            courseType: import("@prisma/client").$Enums.CourseType;
            level: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        courseId: string;
        prerequisiteId: string;
        minimumGrade: string | null;
        createdAt: Date;
    })[];
    prerequisites: ({
        prerequisite: {
            id: string;
            departmentId: string;
            code: string;
            title: string;
            description: string | null;
            credits: Prisma.Decimal;
            courseType: import("@prisma/client").$Enums.CourseType;
            level: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        courseId: string;
        prerequisiteId: string;
        minimumGrade: string | null;
        createdAt: Date;
    })[];
} & {
    id: string;
    departmentId: string;
    code: string;
    title: string;
    description: string | null;
    credits: Prisma.Decimal;
    courseType: import("@prisma/client").$Enums.CourseType;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const updateCourse: (id: string, input: UpdateCourseInput) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    title: string;
    description: string | null;
    credits: Prisma.Decimal;
    courseType: import("@prisma/client").$Enums.CourseType;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const activateCourse: (id: string) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    title: string;
    description: string | null;
    credits: Prisma.Decimal;
    courseType: import("@prisma/client").$Enums.CourseType;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const deactivateCourse: (id: string) => Promise<{
    department: {
        id: string;
        code: string;
        name: string;
        description: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    departmentId: string;
    code: string;
    title: string;
    description: string | null;
    credits: Prisma.Decimal;
    courseType: import("@prisma/client").$Enums.CourseType;
    level: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const deleteCourse: (id: string) => Promise<void>;
//# sourceMappingURL=course.service.d.ts.map
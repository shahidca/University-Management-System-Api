import { Prisma } from "@prisma/client";
import type { CreateSectionScheduleInput, SectionScheduleListQueryInput, UpdateSectionScheduleInput } from "./section-schedule.validation.js";
export declare const createSectionSchedule: (input: CreateSectionScheduleInput) => Promise<{
    building: string | null;
    createdAt: Date;
    dayOfWeek: number;
    endTime: string;
    id: string;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
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
                status: import("@prisma/client").$Enums.SemesterStatus;
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
    startTime: string;
    updatedAt: Date;
}>;
export declare const getSectionSchedules: (query: SectionScheduleListQueryInput) => Promise<{
    items: {
        building: string | null;
        createdAt: Date;
        dayOfWeek: number;
        endTime: string;
        id: string;
        room: string | null;
        section: {
            capacity: number;
            courseOffering: {
                code: string;
                course: {
                    code: string;
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
                    status: import("@prisma/client").$Enums.SemesterStatus;
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
        startTime: string;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getSectionScheduleById: (id: string) => Promise<{
    building: string | null;
    createdAt: Date;
    dayOfWeek: number;
    endTime: string;
    id: string;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
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
                status: import("@prisma/client").$Enums.SemesterStatus;
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
    startTime: string;
    updatedAt: Date;
}>;
export declare const updateSectionSchedule: (id: string, input: UpdateSectionScheduleInput) => Promise<{
    building: string | null;
    createdAt: Date;
    dayOfWeek: number;
    endTime: string;
    id: string;
    room: string | null;
    section: {
        capacity: number;
        courseOffering: {
            code: string;
            course: {
                code: string;
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
                status: import("@prisma/client").$Enums.SemesterStatus;
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
    startTime: string;
    updatedAt: Date;
}>;
export declare const deleteSectionSchedule: (id: string) => Promise<{
    id: string;
    deleted: boolean;
}>;
//# sourceMappingURL=section-schedule.service.d.ts.map
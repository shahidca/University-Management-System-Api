import { Prisma } from "@prisma/client";
import type { AttendanceListQueryInput, CreateAttendanceInput, UpdateAttendanceInput } from "./attendance.validation.js";
export declare const createAttendance: (userId: string, input: CreateAttendanceInput) => Promise<{
    createdAt: Date;
    date: Date;
    enrollment: {
        enrolledAt: Date | null;
        id: string;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    id: string;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
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
    };
    enrollmentId: string;
    id: string;
    markedById: string;
    remarks: string | null;
    status: import("@prisma/client").$Enums.AttendanceStatus;
    updatedAt: Date;
}>;
export declare const updateAttendance: (userId: string, id: string, input: UpdateAttendanceInput) => Promise<{
    createdAt: Date;
    date: Date;
    enrollment: {
        enrolledAt: Date | null;
        id: string;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    id: string;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
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
    };
    enrollmentId: string;
    id: string;
    markedById: string;
    remarks: string | null;
    status: import("@prisma/client").$Enums.AttendanceStatus;
    updatedAt: Date;
}>;
export declare const deleteAttendance: (userId: string, id: string) => Promise<{
    id: string;
}>;
export declare const getAttendanceById: (id: string) => Promise<{
    createdAt: Date;
    date: Date;
    enrollment: {
        enrolledAt: Date | null;
        id: string;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    id: string;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
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
    };
    enrollmentId: string;
    id: string;
    markedById: string;
    remarks: string | null;
    status: import("@prisma/client").$Enums.AttendanceStatus;
    updatedAt: Date;
}>;
export declare const getAttendances: (query: AttendanceListQueryInput) => Promise<{
    items: {
        createdAt: Date;
        date: Date;
        enrollment: {
            enrolledAt: Date | null;
            id: string;
            section: {
                courseOffering: {
                    code: string;
                    course: {
                        code: string;
                        id: string;
                        title: string;
                    };
                    credits: Prisma.Decimal;
                    id: string;
                    semester: {
                        code: string;
                        id: string;
                        name: string;
                        status: import("@prisma/client").$Enums.SemesterStatus;
                    };
                    title: string;
                };
                id: string;
                instructorId: string;
                name: string;
                sectionCode: string;
            };
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
        };
        enrollmentId: string;
        id: string;
        markedById: string;
        remarks: string | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getMyAttendance: (userId: string, query: AttendanceListQueryInput) => Promise<{
    items: {
        createdAt: Date;
        date: Date;
        enrollment: {
            enrolledAt: Date | null;
            id: string;
            section: {
                courseOffering: {
                    code: string;
                    course: {
                        code: string;
                        id: string;
                        title: string;
                    };
                    credits: Prisma.Decimal;
                    id: string;
                    semester: {
                        code: string;
                        id: string;
                        name: string;
                        status: import("@prisma/client").$Enums.SemesterStatus;
                    };
                    title: string;
                };
                id: string;
                instructorId: string;
                name: string;
                sectionCode: string;
            };
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
        };
        enrollmentId: string;
        id: string;
        markedById: string;
        remarks: string | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getAttendanceSummary: (enrollmentId: string) => Promise<{
    enrollment: {
        id: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
    };
    student: {
        firstName: string;
        id: string;
        lastName: string;
        studentId: string;
    };
    section: {
        id: string;
        sectionCode: string;
        name: string;
    };
    course: {
        code: string;
        title: string;
        offeringCode: string;
        offeringTitle: string;
    };
    summary: {
        totalClasses: number;
        present: number;
        late: number;
        absent: number;
        excused: number;
        countedClasses: number;
        attendedClasses: number;
        attendancePercentage: number;
    };
}>;
//# sourceMappingURL=attendance.service.d.ts.map
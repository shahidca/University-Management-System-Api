import { z } from "zod";
export declare const createAttendanceSchema: z.ZodObject<{
    enrollmentId: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    status: z.ZodEnum<{
        ABSENT: "ABSENT";
        EXCUSED: "EXCUSED";
        LATE: "LATE";
        PRESENT: "PRESENT";
    }>;
    remarks: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateAttendanceSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ABSENT: "ABSENT";
        EXCUSED: "EXCUSED";
        LATE: "LATE";
        PRESENT: "PRESENT";
    }>;
    remarks: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const attendanceListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    enrollmentId: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    sectionId: z.ZodOptional<z.ZodString>;
    markedById: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ABSENT: "ABSENT";
        EXCUSED: "EXCUSED";
        LATE: "LATE";
        PRESENT: "PRESENT";
    }>>;
    dateFrom: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateTo: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        date: "date";
        status: "status";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceListQueryInput = z.infer<typeof attendanceListQuerySchema>;
//# sourceMappingURL=attendance.validation.d.ts.map
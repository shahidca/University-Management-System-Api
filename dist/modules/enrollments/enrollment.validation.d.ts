import { z } from "zod";
export declare const createEnrollmentSchema: z.ZodObject<{
    sectionId: z.ZodString;
}, z.core.$strip>;
export declare const updateEnrollmentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        DROPPED: "DROPPED";
        ENROLLED: "ENROLLED";
        REJECTED: "REJECTED";
    }>;
}, z.core.$strip>;
export declare const enrollmentListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    studentId: z.ZodOptional<z.ZodString>;
    sectionId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        DROPPED: "DROPPED";
        ENROLLED: "ENROLLED";
        PENDING: "PENDING";
        REJECTED: "REJECTED";
    }>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        droppedAt: "droppedAt";
        enrolledAt: "enrolledAt";
        status: "status";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentStatusInput = z.infer<typeof updateEnrollmentStatusSchema>;
export type EnrollmentListQueryInput = z.infer<typeof enrollmentListQuerySchema>;
//# sourceMappingURL=enrollment.validation.d.ts.map
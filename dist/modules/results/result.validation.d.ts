import { z } from "zod";
export declare const createResultSchema: z.ZodObject<{
    examId: z.ZodString;
    enrollmentId: z.ZodString;
    marksObtained: z.ZodCoercedNumber<unknown>;
    remarks: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateResultSchema: z.ZodObject<{
    marksObtained: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    remarks: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const resultListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    examId: z.ZodOptional<z.ZodString>;
    enrollmentId: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    sectionId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        APPROVED: "APPROVED";
        DRAFT: "DRAFT";
        PUBLISHED: "PUBLISHED";
        SUBMITTED: "SUBMITTED";
    }>>;
    grade: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        grade: "grade";
        gradePoint: "gradePoint";
        marksObtained: "marksObtained";
        status: "status";
        updatedAt: "updatedAt";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateResultInput = z.infer<typeof createResultSchema>;
export type UpdateResultInput = z.infer<typeof updateResultSchema>;
export type ResultListQueryInput = z.infer<typeof resultListQuerySchema>;
//# sourceMappingURL=result.validation.d.ts.map
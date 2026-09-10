import { z } from "zod";
export declare const transcriptIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const transcriptSemesterParamsSchema: z.ZodObject<{
    semesterId: z.ZodString;
}, z.core.$strip>;
export declare const transcriptStudentParamsSchema: z.ZodObject<{
    studentId: z.ZodString;
}, z.core.$strip>;
export declare const transcriptListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    studentId: z.ZodOptional<z.ZodString>;
    semesterId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        APPROVED: "APPROVED";
        DRAFT: "DRAFT";
        GENERATED: "GENERATED";
        ISSUED: "ISSUED";
        REVOKED: "REVOKED";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type TranscriptListQueryInput = z.infer<typeof transcriptListQuerySchema>;
//# sourceMappingURL=transcript.validation.d.ts.map
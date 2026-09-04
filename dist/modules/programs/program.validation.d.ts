import { z } from "zod";
export declare const createProgramSchema: z.ZodObject<{
    departmentId: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    degree: z.ZodString;
    durationYears: z.ZodNumber;
    totalCredits: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateProgramSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    degree: z.ZodOptional<z.ZodString>;
    durationYears: z.ZodOptional<z.ZodNumber>;
    totalCredits: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const programListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    departmentId: z.ZodOptional<z.ZodString>;
    degree: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        code: "code";
        createdAt: "createdAt";
        degree: "degree";
        durationYears: "durationYears";
        name: "name";
        totalCredits: "totalCredits";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ProgramListQueryInput = z.infer<typeof programListQuerySchema>;
//# sourceMappingURL=program.validation.d.ts.map
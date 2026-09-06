import { z } from "zod";
export declare const createExamSchema: z.ZodObject<{
    sectionId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    examType: z.ZodEnum<{
        ASSIGNMENT: "ASSIGNMENT";
        FINAL: "FINAL";
        MIDTERM: "MIDTERM";
        PRESENTATION: "PRESENTATION";
        PROJECT: "PROJECT";
        QUIZ: "QUIZ";
        VIVA: "VIVA";
    }>;
    totalMarks: z.ZodCoercedNumber<unknown>;
    examDate: z.ZodCoercedDate<unknown>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    room: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateExamSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    examType: z.ZodOptional<z.ZodEnum<{
        ASSIGNMENT: "ASSIGNMENT";
        FINAL: "FINAL";
        MIDTERM: "MIDTERM";
        PRESENTATION: "PRESENTATION";
        PROJECT: "PROJECT";
        QUIZ: "QUIZ";
        VIVA: "VIVA";
    }>>;
    totalMarks: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    examDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    startTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    room: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const examListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sectionId: z.ZodOptional<z.ZodString>;
    examType: z.ZodOptional<z.ZodEnum<{
        ASSIGNMENT: "ASSIGNMENT";
        FINAL: "FINAL";
        MIDTERM: "MIDTERM";
        PRESENTATION: "PRESENTATION";
        PROJECT: "PROJECT";
        QUIZ: "QUIZ";
        VIVA: "VIVA";
    }>>;
    isPublished: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        false: "false";
        true: "true";
    }>, z.ZodTransform<boolean, "false" | "true">>>;
    dateFrom: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateTo: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        examDate: "examDate";
        examType: "examType";
        title: "title";
        totalMarks: "totalMarks";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
export type ExamListQueryInput = z.infer<typeof examListQuerySchema>;
//# sourceMappingURL=exam.validation.d.ts.map
import { z } from "zod";
export declare const createSemesterSchema: z.ZodObject<{
    academicYearId: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    type: z.ZodEnum<{
        FALL: "FALL";
        SPRING: "SPRING";
        SUMMER: "SUMMER";
    }>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    registrationOpen: z.ZodString;
    registrationClose: z.ZodString;
}, z.core.$strip>;
export declare const updateSemesterSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        FALL: "FALL";
        SPRING: "SPRING";
        SUMMER: "SUMMER";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    registrationOpen: z.ZodOptional<z.ZodString>;
    registrationClose: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const semesterListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    academicYearId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        FALL: "FALL";
        SPRING: "SPRING";
        SUMMER: "SUMMER";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        COMPLETED: "COMPLETED";
        PLANNED: "PLANNED";
        REGISTRATION_CLOSED: "REGISTRATION_CLOSED";
        REGISTRATION_OPEN: "REGISTRATION_OPEN";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        code: "code";
        createdAt: "createdAt";
        endDate: "endDate";
        name: "name";
        registrationClose: "registrationClose";
        registrationOpen: "registrationOpen";
        startDate: "startDate";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateSemesterInput = z.infer<typeof createSemesterSchema>;
export type UpdateSemesterInput = z.infer<typeof updateSemesterSchema>;
export type SemesterListQueryInput = z.infer<typeof semesterListQuerySchema>;
//# sourceMappingURL=semester.validation.d.ts.map
import { z } from "zod";
export declare const createSectionScheduleSchema: z.ZodObject<{
    sectionId: z.ZodString;
    dayOfWeek: z.ZodCoercedNumber<unknown>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    room: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateSectionScheduleSchema: z.ZodObject<{
    dayOfWeek: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    room: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    building: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const sectionScheduleListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sectionId: z.ZodOptional<z.ZodString>;
    dayOfWeek: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    room: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        dayOfWeek: "dayOfWeek";
        endTime: "endTime";
        startTime: "startTime";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type CreateSectionScheduleInput = z.infer<typeof createSectionScheduleSchema>;
export type UpdateSectionScheduleInput = z.infer<typeof updateSectionScheduleSchema>;
export type SectionScheduleListQueryInput = z.infer<typeof sectionScheduleListQuerySchema>;
//# sourceMappingURL=section-schedule.validation.d.ts.map
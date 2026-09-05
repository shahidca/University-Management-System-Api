import { z } from "zod";
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeSchema = z
    .string()
    .regex(timeRegex, "Time must be in HH:mm format");
export const createSectionScheduleSchema = z
    .object({
    sectionId: z
        .string()
        .uuid(),
    dayOfWeek: z
        .coerce
        .number()
        .int()
        .min(0)
        .max(6),
    startTime: timeSchema,
    endTime: timeSchema,
    room: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),
    building: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),
})
    .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be earlier than end time",
    path: ["endTime"],
});
export const updateSectionScheduleSchema = z
    .object({
    dayOfWeek: z
        .coerce
        .number()
        .int()
        .min(0)
        .max(6)
        .optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    room: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .nullable()
        .optional(),
    building: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .nullable()
        .optional(),
})
    .refine((data) => {
    if (data.startTime === undefined ||
        data.endTime === undefined) {
        return true;
    }
    return data.startTime < data.endTime;
}, {
    message: "Start time must be earlier than end time",
    path: ["endTime"],
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
export const sectionScheduleListQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),
    sectionId: z
        .string()
        .uuid()
        .optional(),
    dayOfWeek: z.coerce
        .number()
        .int()
        .min(0)
        .max(6)
        .optional(),
    room: z
        .string()
        .trim()
        .max(100)
        .optional(),
    building: z
        .string()
        .trim()
        .max(100)
        .optional(),
    sortBy: z
        .enum([
        "dayOfWeek",
        "startTime",
        "endTime",
        "createdAt",
    ])
        .default("dayOfWeek"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("asc"),
});
//# sourceMappingURL=section-schedule.validation.js.map
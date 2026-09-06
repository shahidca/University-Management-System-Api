import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const timeSchema = z
  .string()
  .regex(
    timeRegex,
    "Time must be in HH:mm format",
  );

export const createExamSchema = z
  .object({
    sectionId: z.string().uuid(),

    title: z
      .string()
      .trim()
      .min(2)
      .max(200),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    examType: z.enum([
      "QUIZ",
      "ASSIGNMENT",
      "MIDTERM",
      "FINAL",
      "VIVA",
      "PROJECT",
      "PRESENTATION",
    ]),

    totalMarks: z.coerce
      .number()
      .positive()
      .max(999999.99),

    examDate: z.coerce.date(),

    startTime: timeSchema.optional(),

    endTime: timeSchema.optional(),

    room: z
      .string()
      .trim()
      .max(100)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.startTime && !data.endTime) ||
      (!data.startTime && data.endTime)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Both startTime and endTime are required when specifying exam time",
        path: [
          data.startTime
            ? "endTime"
            : "startTime",
        ],
      });

      return;
    }

    if (
      data.startTime &&
      data.endTime &&
      data.startTime >= data.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "startTime must be before endTime",
        path: ["endTime"],
      });
    }
  });

export const updateExamSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),

    examType: z.enum([
      "QUIZ",
      "ASSIGNMENT",
      "MIDTERM",
      "FINAL",
      "VIVA",
      "PROJECT",
      "PRESENTATION",
    ]).optional(),

    totalMarks: z.coerce
      .number()
      .positive()
      .max(999999.99)
      .optional(),

    examDate: z.coerce
      .date()
      .optional(),

    startTime: timeSchema
      .nullable()
      .optional(),

    endTime: timeSchema
      .nullable()
      .optional(),

    room: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.startTime !== undefined &&
      data.endTime !== undefined &&
      data.startTime !== null &&
      data.endTime !== null &&
      data.startTime >= data.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "startTime must be before endTime",
        path: ["endTime"],
      });
    }

    if (
      data.startTime !== undefined &&
      data.startTime !== null &&
      data.endTime === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "endTime is required when startTime is provided",
        path: ["endTime"],
      });
    }

    if (
      data.endTime !== undefined &&
      data.endTime !== null &&
      data.startTime === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "startTime is required when endTime is provided",
        path: ["startTime"],
      });
    }
  })
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one field is required",
    },
  );

export const examListQuerySchema =
  z.object({
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

    examType: z.enum([
      "QUIZ",
      "ASSIGNMENT",
      "MIDTERM",
      "FINAL",
      "VIVA",
      "PROJECT",
      "PRESENTATION",
    ]).optional(),

    isPublished: z
      .enum(["true", "false"])
      .transform(
        (value) => value === "true",
      )
      .optional(),

    dateFrom: z.coerce
      .date()
      .optional(),

    dateTo: z.coerce
      .date()
      .optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),

    sortBy: z.enum([
      "title",
      "examType",
      "examDate",
      "totalMarks",
      "createdAt",
    ]).default("examDate"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("asc"),
  })
  .refine(
    (data) => {
      if (
        data.dateFrom &&
        data.dateTo
      ) {
        return (
          data.dateFrom <=
          data.dateTo
        );
      }

      return true;
    },
    {
      message:
        "dateFrom must be before or equal to dateTo",
      path: ["dateTo"],
    },
  );

export type CreateExamInput =
  z.infer<typeof createExamSchema>;

export type UpdateExamInput =
  z.infer<typeof updateExamSchema>;

export type ExamListQueryInput =
  z.infer<typeof examListQuerySchema>;
import { z } from "zod";

export const createAttendanceSchema =
  z.object({
    enrollmentId: z.string().uuid(),

    date: z.coerce.date(),

    status: z.enum([
      "PRESENT",
      "ABSENT",
      "LATE",
      "EXCUSED",
    ]),

    remarks: z
      .string()
      .trim()
      .max(500)
      .optional(),
  });

export const updateAttendanceSchema =
  z
    .object({
      status: z.enum([
        "PRESENT",
        "ABSENT",
        "LATE",
        "EXCUSED",
      ]),

      remarks: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .optional(),
    })
    .refine(
      (data) =>
        data.status !== undefined ||
        data.remarks !== undefined,
      {
        message:
          "At least one field is required",
      },
    );

export const attendanceListQuerySchema =
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

    enrollmentId: z
      .string()
      .uuid()
      .optional(),

    studentId: z
      .string()
      .uuid()
      .optional(),

    sectionId: z
      .string()
      .uuid()
      .optional(),

    markedById: z
      .string()
      .uuid()
      .optional(),

    status: z
      .enum([
        "PRESENT",
        "ABSENT",
        "LATE",
        "EXCUSED",
      ])
      .optional(),

    dateFrom: z.coerce
      .date()
      .optional(),

    dateTo: z.coerce
      .date()
      .optional(),

    sortBy: z
      .enum([
        "date",
        "status",
        "createdAt",
      ])
      .default("date"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
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

export type CreateAttendanceInput =
  z.infer<
    typeof createAttendanceSchema
  >;

export type UpdateAttendanceInput =
  z.infer<
    typeof updateAttendanceSchema
  >;

export type AttendanceListQueryInput =
  z.infer<
    typeof attendanceListQuerySchema
  >;
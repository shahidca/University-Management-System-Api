import { z } from "zod";

const semesterTypes = [
  "FALL",
  "SPRING",
  "SUMMER",
] as const;

export const createSemesterSchema =
  z
    .object({
      academicYearId: z
        .string()
        .trim()
        .min(
          1,
          "Academic year ID is required",
        ),

      name: z
        .string()
        .trim()
        .min(
          2,
          "Semester name must be at least 2 characters",
        )
        .max(
          100,
          "Semester name must not exceed 100 characters",
        ),

      code: z
        .string()
        .trim()
        .min(
          2,
          "Semester code must be at least 2 characters",
        )
        .max(
          30,
          "Semester code must not exceed 30 characters",
        )
        .toUpperCase(),

      type: z.enum(semesterTypes),

      startDate: z
        .string()
        .datetime({
          message: "Invalid start date",
        }),

      endDate: z
        .string()
        .datetime({
          message: "Invalid end date",
        }),

      registrationOpen: z
        .string()
        .datetime({
          message:
            "Invalid registration open date",
        }),

      registrationClose: z
        .string()
        .datetime({
          message:
            "Invalid registration close date",
        }),
    })
    .superRefine((data, ctx) => {
      const startDate = new Date(
        data.startDate,
      );

      const endDate = new Date(
        data.endDate,
      );

      const registrationOpen =
        new Date(
          data.registrationOpen,
        );

      const registrationClose =
        new Date(
          data.registrationClose,
        );

      if (startDate >= endDate) {
        ctx.addIssue({
          code: "custom",
          message:
            "Start date must be before end date",
          path: ["endDate"],
        });
      }

      if (
        registrationOpen >=
        registrationClose
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Registration open date must be before registration close date",
          path: ["registrationClose"],
        });
      }

      if (registrationClose > startDate) {
        ctx.addIssue({
          code: "custom",
          message:
            "Registration must close on or before the semester start date",
          path: ["registrationClose"],
        });
      }
    });

export const updateSemesterSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Semester name must be at least 2 characters",
        )
        .max(
          100,
          "Semester name must not exceed 100 characters",
        )
        .optional(),

      code: z
        .string()
        .trim()
        .min(
          2,
          "Semester code must be at least 2 characters",
        )
        .max(
          30,
          "Semester code must not exceed 30 characters",
        )
        .toUpperCase()
        .optional(),

      type: z
        .enum(semesterTypes)
        .optional(),

      startDate: z
        .string()
        .datetime({
          message: "Invalid start date",
        })
        .optional(),

      endDate: z
        .string()
        .datetime({
          message: "Invalid end date",
        })
        .optional(),

      registrationOpen: z
        .string()
        .datetime({
          message:
            "Invalid registration open date",
        })
        .optional(),

      registrationClose: z
        .string()
        .datetime({
          message:
            "Invalid registration close date",
        })
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field is required",
      },
    );

export const semesterListQuerySchema =
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

    academicYearId: z
      .string()
      .trim()
      .optional(),

    type: z
      .enum(semesterTypes)
      .optional(),

    status: z
      .enum([
        "PLANNED",
        "REGISTRATION_OPEN",
        "REGISTRATION_CLOSED",
        "ACTIVE",
        "COMPLETED",
      ])
      .optional(),

    search: z
      .string()
      .trim()
      .max(100)
      .optional(),

    sortBy: z
      .enum([
        "name",
        "code",
        "startDate",
        "endDate",
        "registrationOpen",
        "registrationClose",
        "createdAt",
      ])
      .default("startDate"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("asc"),
  });

export type CreateSemesterInput =
  z.infer<
    typeof createSemesterSchema
  >;

export type UpdateSemesterInput =
  z.infer<
    typeof updateSemesterSchema
  >;

export type SemesterListQueryInput =
  z.infer<
    typeof semesterListQuerySchema
  >;
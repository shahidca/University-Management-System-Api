import { z } from "zod";

export const transcriptIdParamsSchema =
  z.object({
    id: z.string().uuid(),
  });

export const transcriptSemesterParamsSchema =
  z.object({
    semesterId: z.string().uuid(),
  });

export const transcriptStudentParamsSchema =
  z.object({
    studentId: z.string().uuid(),
  });

export const transcriptListQuerySchema =
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

    studentId: z
      .string()
      .uuid()
      .optional(),

    semesterId: z
      .string()
      .uuid()
      .optional(),

    status: z
      .enum([
        "DRAFT",
        "GENERATED",
        "APPROVED",
        "ISSUED",
        "REVOKED",
      ])
      .optional(),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export type TranscriptListQueryInput =
  z.infer<
    typeof transcriptListQuerySchema
  >;
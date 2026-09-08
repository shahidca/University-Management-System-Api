import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import {
  calculateGpa,
  type GpaCourseResult,
} from "../results/result.gpa.js";

import type {
  TranscriptListQueryInput,
} from "./transcript.validation.js";

const transcriptSelect =
  Prisma.validator<Prisma.TranscriptSelect>()({
    id: true,
    studentId: true,
    semesterId: true,
    transcriptNo: true,
    status: true,
    semesterGpa: true,
    cumulativeGpa: true,
    totalCredits: true,
    issuedAt: true,
    approvedAt: true,
    createdAt: true,
    updatedAt: true,

    student: {
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,

        program: {
          select: {
            id: true,
            code: true,
            name: true,
            degree: true,
          },
        },
      },
    },

    semester: {
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    },
  });

const generateTranscriptNumber =
  (): string => {
    const timestamp =
      Date.now()
        .toString(36)
        .toUpperCase();

    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `TR-${timestamp}-${random}`;
  };

const getStudentByUserId = async (
  userId: string,
) => {
  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
      },
    });

  if (!student) {
    throw new AppError(
      "Student profile not found",
      404,
    );
  }

  return student;
};

const getPublishedResults = async (
  studentId: string,
  semesterId?: string,
) => {
  return prisma.result.findMany({
    where: {
      status: "PUBLISHED",

      enrollment: {
        studentId,

        ...(semesterId
          ? {
            section: {
              courseOffering: {
                semesterId,
              },
            },
          }
          : {}),
      },
    },

    select: {
      grade: true,
      gradePoint: true,

      enrollment: {
        select: {
          section: {
            select: {
              courseOffering: {
                select: {
                  credits: true,

                  course: {
                    select: {
                      id: true,
                      code: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

const mapResultsToCourses = (
  results: Awaited<
    ReturnType<typeof getPublishedResults>
  >,
): GpaCourseResult[] => {
  return results.map((result) => {
    const course =
      result.enrollment.section
        .courseOffering.course;

    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,

      credits: Number(
        result.enrollment.section
          .courseOffering.credits,
      ),

      grade:
        result.grade ?? "N/A",

      gradePoint: Number(
        result.gradePoint ?? 0,
      ),
    };
  });
};

export const generateSemesterTranscript =
  async (
    userId: string,
    semesterId: string,
  ) => {
    const student =
      await getStudentByUserId(userId);

    const semester =
      await prisma.semester.findUnique({
        where: {
          id: semesterId,
        },

        select: {
          id: true,
          name: true,
          code: true,
          status: true,
        },
      });

    if (!semester) {
      throw new AppError(
        "Semester not found",
        404,
      );
    }

    const existing =
      await prisma.transcript.findFirst({
        where: {
          studentId: student.id,
          semesterId,
        },

        select: {
          id: true,
          status: true,
          transcriptNo: true,
        },
      });

    if (existing) {
      throw new AppError(
        "A transcript already exists for this semester",
        409,
        [existing],
      );
    }

    const results =
      await getPublishedResults(
        student.id,
        semesterId,
      );

    if (results.length === 0) {
      throw new AppError(
        "No published results available for this semester",
        404,
      );
    }

    const courses =
      mapResultsToCourses(results);

    const calculation =
      calculateGpa(courses);

    const transcript =
      await prisma.transcript.create({
        data: {
          studentId: student.id,
          semesterId,

          transcriptNo:
            generateTranscriptNumber(),

          status: "GENERATED",

          semesterGpa:
            calculation.gpa,

          cumulativeGpa:
            calculation.gpa,

          totalCredits:
            calculation.totalCredits,
        },

        select: transcriptSelect,
      });

    return transcript;
  };

export const getTranscriptById =
  async (
    userId: string,
    role: Role,
    id: string,
  ) => {
    const where: Prisma.TranscriptWhereInput =
    {
      id,
    };

    if (role === "STUDENT") {
      const student =
        await getStudentByUserId(userId);

      where.studentId = student.id;

      where.status = {
        not: "REVOKED",
      };
    }

    const transcript =
      await prisma.transcript.findFirst({
        where,

        select: transcriptSelect,
      });

    if (!transcript) {
      throw new AppError(
        "Transcript not found",
        404,
      );
    }

    return transcript;
  };

export const getTranscripts =
  async (
    userId: string,
    role: Role,
    query: TranscriptListQueryInput,
  ) => {
    const {
      page,
      limit,
      studentId,
      semesterId,
      status,
      sortOrder,
    } = query;

    const skip =
      (page - 1) * limit;

    const where: Prisma.TranscriptWhereInput =
    {
      ...(studentId
        ? {
          studentId,
        }
        : {}),

      ...(semesterId
        ? {
          semesterId,
        }
        : {}),

      ...(status
        ? {
          status,
        }
        : {}),
    };

    if (role === "STUDENT") {
      const student =
        await getStudentByUserId(userId);

      where.studentId = student.id;

      if (status === "REVOKED") {
        throw new AppError(
          "Students cannot access revoked transcripts",
          403,
        );
      }

      if (status) {
        where.status = status;
      } else {
        where.status = {
          not: "REVOKED",
        };
      }
    }

    const [items, total] =
      await prisma.$transaction([
        prisma.transcript.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: sortOrder,
          },

          select: transcriptSelect,
        }),

        prisma.transcript.count({
          where,
        }),
      ]);

    return {
      items,

      pagination: {
        page,
        limit,
        total,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  };


export const approveTranscript = async (
  id: string,
  actorId: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const transcript =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          transcriptNo: true,
        },
      });

    if (!transcript) {
      throw new AppError(
        "Transcript not found",
        404,
      );
    }

    if (transcript.status !== "GENERATED") {
      throw new AppError(
        `Transcript cannot be approved from ${transcript.status} status`,
        400,
      );
    }

    const approvedAt = new Date();

    const updatedTranscript =
      await tx.transcript.updateMany({
        where: {
          id,
          status: "GENERATED",
        },
        data: {
          status: "APPROVED",
          approvedAt,
        },
      });

    if (updatedTranscript.count !== 1) {
      throw new AppError(
        "Transcript approval failed because its status changed",
        409,
      );
    }

    const transcriptAfter =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: transcriptSelect,
      });

    if (!transcriptAfter) {
      throw new AppError(
        "Transcript not found after approval",
        404,
      );
    }

    await tx.auditLog.create({
      data: {
        actorId,
        action: "TRANSCRIPT_APPROVED",
        entity: "Transcript",
        entityId: transcript.id,

        oldValue: {
          status: transcript.status,
        },

        newValue: {
          status: "APPROVED",
          approvedAt,
        },

        ...(ipAddress !== undefined
          ? { ipAddress }
          : {}),

        ...(userAgent !== undefined
          ? { userAgent }
          : {}),
      },
    });

    return transcriptAfter;
  });
};

export const issueTranscript = async (
  id: string,
  actorId: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const transcript =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          transcriptNo: true,
        },
      });

    if (!transcript) {
      throw new AppError(
        "Transcript not found",
        404,
      );
    }

    if (transcript.status !== "APPROVED") {
      throw new AppError(
        `Transcript cannot be issued from ${transcript.status} status`,
        400,
      );
    }

    const issuedAt = new Date();

    const updatedTranscript =
      await tx.transcript.updateMany({
        where: {
          id,
          status: "APPROVED",
        },
        data: {
          status: "ISSUED",
          issuedAt,
        },
      });

    if (updatedTranscript.count !== 1) {
      throw new AppError(
        "Transcript issuance failed because its status changed",
        409,
      );
    }

    const transcriptAfter =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: transcriptSelect,
      });

    if (!transcriptAfter) {
      throw new AppError(
        "Transcript not found after issuance",
        404,
      );
    }

    await tx.auditLog.create({
      data: {
        actorId,
        action: "TRANSCRIPT_ISSUED",
        entity: "Transcript",
        entityId: transcript.id,

        oldValue: {
          status: transcript.status,
        },

        newValue: {
          status: "ISSUED",
          issuedAt,
        },

        ...(ipAddress !== undefined
          ? { ipAddress }
          : {}),

        ...(userAgent !== undefined
          ? { userAgent }
          : {}),
      },
    });

    return transcriptAfter;
  });
};

export const getMyIssuedTranscripts =
  async (
    userId: string,
  ) => {
    const student =
      await getStudentByUserId(userId);

    return prisma.transcript.findMany({
      where: {
        studentId: student.id,
        status: "ISSUED",
      },

      orderBy: {
        issuedAt: "desc",
      },

      select: transcriptSelect,
    });
  };

export const revokeTranscript = async (
  id: string,
  actorId: string,
  ipAddress?: string,
  userAgent?: string,
) => {
  return prisma.$transaction(async (tx) => {
    const transcript =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          transcriptNo: true,
        },
      });

    if (!transcript) {
      throw new AppError(
        "Transcript not found",
        404,
      );
    }

    if (transcript.status !== "ISSUED") {
      throw new AppError(
        `Transcript cannot be revoked from ${transcript.status} status`,
        400,
      );
    }

    const updatedTranscript =
      await tx.transcript.updateMany({
        where: {
          id,
          status: "ISSUED",
        },
        data: {
          status: "REVOKED",
        },
      });

    if (updatedTranscript.count !== 1) {
      throw new AppError(
        "Transcript revocation failed because its status changed",
        409,
      );
    }

    const transcriptAfter =
      await tx.transcript.findUnique({
        where: {
          id,
        },
        select: transcriptSelect,
      });

    if (!transcriptAfter) {
      throw new AppError(
        "Transcript not found after revocation",
        404,
      );
    }

    await tx.auditLog.create({
      data: {
        actorId,
        action: "TRANSCRIPT_REVOKED",
        entity: "Transcript",
        entityId: transcript.id,

        oldValue: {
          status: transcript.status,
        },

        newValue: {
          status: "REVOKED",
        },

        ...(ipAddress !== undefined
          ? { ipAddress }
          : {}),

        ...(userAgent !== undefined
          ? { userAgent }
          : {}),
      },
    });

    return transcriptAfter;
  });
};

export const getStudentTranscripts =
  async (
    studentId: string,
    query: TranscriptListQueryInput,
  ) => {
    const student =
      await prisma.studentProfile.findUnique({
        where: {
          id: studentId,
        },

        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
        },
      });

    if (!student) {
      throw new AppError(
        "Student profile not found",
        404,
      );
    }

    const {
      page,
      limit,
      semesterId,
      status,
      sortOrder,
    } = query;

    const skip =
      (page - 1) * limit;

    const where: Prisma.TranscriptWhereInput =
    {
      studentId,

      ...(semesterId
        ? {
          semesterId,
        }
        : {}),

      ...(status
        ? {
          status,
        }
        : {}),
    };

    const [items, total] =
      await prisma.$transaction([
        prisma.transcript.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: sortOrder,
          },

          select: transcriptSelect,
        }),

        prisma.transcript.count({
          where,
        }),
      ]);

    return {
      student,
      items,

      pagination: {
        page,
        limit,
        total,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  };
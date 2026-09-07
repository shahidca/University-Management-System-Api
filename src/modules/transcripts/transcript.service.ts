import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import {
  calculateCgpa,
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
      Date.now().toString(36).toUpperCase();

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
      grade: result.grade ?? "N/A",
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
          generatedAt: undefined,
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

    const skip = (page - 1) * limit;

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
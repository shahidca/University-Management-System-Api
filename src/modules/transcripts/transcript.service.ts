
import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

import {
  calculateCgpa,
  calculateGpa,
  type GpaCourseResult,
} from "../results/result.gpa.js";

import {
  calculateCourseGrade,
  type ExamResultInput,
} from "../results/result.course-grade.js";

import type {
  TranscriptListQueryInput,
} from "./transcript.validation.js";

/**
 * ---------------------------------------------------------
 * TRANSCRIPT SELECT
 * ---------------------------------------------------------
 */

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

/**
 * ---------------------------------------------------------
 * TRANSCRIPT NUMBER
 * ---------------------------------------------------------
 */

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

/**
 * ---------------------------------------------------------
 * STUDENT
 * ---------------------------------------------------------
 */

const getStudentByUserId =
  async (
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

/**
 * ---------------------------------------------------------
 * PUBLISHED RESULT TYPE
 * ---------------------------------------------------------
 */

interface PublishedExamResult {
  id: string;
  marksObtained: Prisma.Decimal;

  exam: {
    id: string;
    examType: string;
    totalMarks: Prisma.Decimal;

    section: {
      courseOffering: {
        courseId: string;
        credits: Prisma.Decimal;

        course: {
          id: string;
          code: string;
          title: string;
        };

        semester: {
          id: string;
          name: string;
          code: string;
        };
      };
    };
  };
}

/**
 * ---------------------------------------------------------
 * GET PUBLISHED EXAM RESULTS
 * ---------------------------------------------------------
 */

const getPublishedExamResults =
  async (
    studentId: string,
    semesterId?: string,
  ): Promise<
    PublishedExamResult[]
  > => {
    return prisma.result.findMany({
      where: {
        status: "PUBLISHED",

        enrollment: {
          studentId,

          status: {
            in: [
              "ENROLLED",
              "COMPLETED",
            ],
          },

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

        ...(semesterId
          ? {
              exam: {
                section: {
                  courseOffering: {
                    semesterId,
                  },
                },
              },
            }
          : {}),
      },

      select: {
        id: true,
        marksObtained: true,

        exam: {
          select: {
            id: true,
            examType: true,
            totalMarks: true,

            section: {
              select: {
                courseOffering: {
                  select: {
                    courseId: true,
                    credits: true,

                    course: {
                      select: {
                        id: true,
                        code: true,
                        title: true,
                      },
                    },

                    semester: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  };

/**
 * ---------------------------------------------------------
 * COURSE AGGREGATION
 * ---------------------------------------------------------
 *
 * A single course can contain multiple exams.
 *
 * Example:
 *
 * CSE101
 *   Quiz
 *   Midterm
 *   Final
 *
 * These must become ONE course result before GPA
 * calculation.
 */

interface AggregatedCourse {
  courseId: string;
  semesterId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  exams: ExamResultInput[];
}

const aggregateCourses =
  (
    results: PublishedExamResult[],
  ): AggregatedCourse[] => {
    const grouped =
      new Map<
        string,
        AggregatedCourse
      >();

    for (
      const result of results
    ) {
      const offering =
        result.exam.section
          .courseOffering;

      const key =
        `${offering.semester.id}:${offering.courseId}`;

      const examResult:
        ExamResultInput = {
          examId:
            result.exam.id,

          examType:
            result.exam.examType,

          marksObtained:
            Number(
              result.marksObtained,
            ),

          totalMarks:
            Number(
              result.exam.totalMarks,
            ),
        };

      const existing =
        grouped.get(key);

      if (existing) {
        existing.exams.push(
          examResult,
        );

        continue;
      }

      grouped.set(
        key,
        {
          courseId:
            offering.courseId,

          semesterId:
            offering.semester.id,

          courseCode:
            offering.course.code,

          courseTitle:
            offering.course.title,

          credits:
            Number(
              offering.credits,
            ),

          exams: [
            examResult,
          ],
        },
      );
    }

    return Array.from(
      grouped.values(),
    );
  };

/**
 * ---------------------------------------------------------
 * BUILD COURSE GRADES
 * ---------------------------------------------------------
 */

const buildCourseGrades =
  (
    courses: AggregatedCourse[],
  ) => {
    return courses.map(
      (course) => {
        const calculation =
          calculateCourseGrade(
            course.exams,
          );

        return {
          semesterId:
            course.semesterId,

          courseId:
            course.courseId,

          courseCode:
            course.courseCode,

          courseTitle:
            course.courseTitle,

          credits:
            course.credits,

          grade:
            calculation.grade,

          gradePoint:
            calculation.gradePoint,

          percentage:
            calculation.percentage,

          totalMarksObtained:
            calculation.totalMarksObtained,

          totalMarks:
            calculation.totalMarks,

          exams:
            calculation.examResults,
        };
      },
    );
  };

/**
 * ---------------------------------------------------------
 * GPA COURSE MAPPING
 * ---------------------------------------------------------
 */

const toGpaCourses =
  (
    courses: ReturnType<
      typeof buildCourseGrades
    >,
  ): GpaCourseResult[] => {
    return courses.map(
      (course) => ({
        courseId:
          course.courseId,

        courseCode:
          course.courseCode,

        courseTitle:
          course.courseTitle,

        credits:
          course.credits,

        grade:
          course.grade,

        gradePoint:
          course.gradePoint,
      }),
    );
  };

/**
 * ---------------------------------------------------------
 * CALCULATE CUMULATIVE GPA
 * ---------------------------------------------------------
 *
 * All published course results across all semesters
 * are aggregated by semester + course.
 *
 * This prevents multiple exams from counting multiple
 * times toward CGPA.
 */

const calculateStudentCumulativeGpa =
  async (
    studentId: string,
  ) => {
    const results =
      await getPublishedExamResults(
        studentId,
      );

    if (
      results.length === 0
    ) {
      throw new AppError(
        "No published results available for cumulative GPA calculation",
        404,
      );
    }

    const courses =
      aggregateCourses(
        results,
      );

    const courseGrades =
      buildCourseGrades(
        courses,
      );

    const gpaCourses =
      toGpaCourses(
        courseGrades,
      );

    return calculateCgpa(
      gpaCourses,
    );
  };

/**
 * ---------------------------------------------------------
 * GENERATE SEMESTER TRANSCRIPT
 * ---------------------------------------------------------
 */

export const generateSemesterTranscript =
  async (
    userId: string,
    semesterId: string,
  ) => {
    const student =
      await getStudentByUserId(
        userId,
      );

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

    /**
     * Prevent duplicate transcript generation.
     */
    const existing =
      await prisma.transcript.findFirst({
        where: {
          studentId:
            student.id,

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

    /**
     * Get all published exam results for this semester.
     */
    const results =
      await getPublishedExamResults(
        student.id,
        semesterId,
      );

    if (
      results.length === 0
    ) {
      throw new AppError(
        "No published results available for this semester",
        404,
      );
    }

    /**
     * Aggregate exams into courses.
     */
    const aggregatedCourses =
      aggregateCourses(
        results,
      );

    /**
     * Calculate one final grade per course.
     */
    const courseGrades =
      buildCourseGrades(
        aggregatedCourses,
      );

    /**
     * Calculate semester GPA.
     */
    const semesterCalculation =
      calculateGpa(
        toGpaCourses(
          courseGrades,
        ),
      );

    /**
     * Calculate true cumulative GPA
     * across all published semesters.
     */
    const cumulativeCalculation =
      await calculateStudentCumulativeGpa(
        student.id,
      );

    try {
      const transcript =
        await prisma.transcript.create({
          data: {
            studentId:
              student.id,

            semesterId,

            transcriptNo:
              generateTranscriptNumber(),

            status:
              "GENERATED",

            semesterGpa:
              semesterCalculation.gpa,

            cumulativeGpa:
              cumulativeCalculation.gpa,

            totalCredits:
              semesterCalculation.totalCredits,
          },

          select:
            transcriptSelect,
        });

      return transcript;
    } catch (error) {
      /**
       * Protect against a transcript number collision.
       */
      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        if (
          error.code ===
          "P2002"
        ) {
          throw new AppError(
            "Unable to generate a unique transcript number. Please try again",
            409,
          );
        }
      }

      throw error;
    }
  };

/**
 * ---------------------------------------------------------
 * GET TRANSCRIPT BY ID
 * ---------------------------------------------------------
 */

export const getTranscriptById =
  async (
    userId: string,
    role: Role,
    id: string,
  ) => {
    const where:
      Prisma.TranscriptWhereInput =
      {
        id,
      };

    /**
     * Students can only access their own
     * non-revoked transcripts.
     */
    if (
      role === "STUDENT"
    ) {
      const student =
        await getStudentByUserId(
          userId,
        );

      where.studentId =
        student.id;

      where.status = {
        not: "REVOKED",
      };
    }

    const transcript =
      await prisma.transcript.findFirst({
        where,

        select:
          transcriptSelect,
      });

    if (!transcript) {
      throw new AppError(
        "Transcript not found",
        404,
      );
    }

    return transcript;
  };

/**
 * ---------------------------------------------------------
 * GET TRANSCRIPTS
 * ---------------------------------------------------------
 */

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
      (page - 1) *
      limit;

    const where:
      Prisma.TranscriptWhereInput =
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

    if (
      role === "STUDENT"
    ) {
      const student =
        await getStudentByUserId(
          userId,
        );

      where.studentId =
        student.id;

      /**
       * Students cannot access revoked
       * transcripts.
       */
      if (
        status ===
        "REVOKED"
      ) {
        throw new AppError(
          "Students cannot access revoked transcripts",
          403,
        );
      }

      if (status) {
        where.status =
          status;
      } else {
        where.status = {
          not: "REVOKED",
        };
      }
    }

    const [
      items,
      total,
    ] =
      await prisma.$transaction([
        prisma.transcript.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt:
              sortOrder,
          },

          select:
            transcriptSelect,
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

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  };

/**
 * ---------------------------------------------------------
 * APPROVE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * GENERATED → APPROVED
 *
 * The transcript update and AuditLog creation happen
 * inside the SAME transaction.
 */

export const approveTranscript =
  async (
    id: string,
    actorId: string,
    ipAddress?: string,
    userAgent?: string,
  ) => {
    return prisma.$transaction(
      async (tx) => {
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

        if (
          transcript.status !==
          "GENERATED"
        ) {
          throw new AppError(
            `Transcript cannot be approved from ${transcript.status} status`,
            400,
          );
        }

        const approvedAt =
          new Date();

        /**
         * Atomic state transition.
         */
        const updated =
          await tx.transcript.updateMany({
            where: {
              id,

              status:
                "GENERATED",
            },

            data: {
              status:
                "APPROVED",

              approvedAt,
            },
          });

        if (
          updated.count !==
          1
        ) {
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

            select:
              transcriptSelect,
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

            action:
              "TRANSCRIPT_APPROVED",

            entity:
              "Transcript",

            entityId:
              transcript.id,

            oldValue: {
              status:
                transcript.status,
            },

            newValue: {
              status:
                "APPROVED",

              approvedAt,
            },

            ...(ipAddress !==
            undefined
              ? {
                  ipAddress,
                }
              : {}),

            ...(userAgent !==
            undefined
              ? {
                  userAgent,
                }
              : {}),
          },
        });

        return transcriptAfter;
      },
    );
  };

/**
 * ---------------------------------------------------------
 * ISSUE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * APPROVED → ISSUED
 */

export const issueTranscript =
  async (
    id: string,
    actorId: string,
    ipAddress?: string,
    userAgent?: string,
  ) => {
    return prisma.$transaction(
      async (tx) => {
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

        if (
          transcript.status !==
          "APPROVED"
        ) {
          throw new AppError(
            `Transcript cannot be issued from ${transcript.status} status`,
            400,
          );
        }

        const issuedAt =
          new Date();

        const updated =
          await tx.transcript.updateMany({
            where: {
              id,

              status:
                "APPROVED",
            },

            data: {
              status:
                "ISSUED",

              issuedAt,
            },
          });

        if (
          updated.count !==
          1
        ) {
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

            select:
              transcriptSelect,
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

            action:
              "TRANSCRIPT_ISSUED",

            entity:
              "Transcript",

            entityId:
              transcript.id,

            oldValue: {
              status:
                transcript.status,
            },

            newValue: {
              status:
                "ISSUED",

              issuedAt,
            },

            ...(ipAddress !==
            undefined
              ? {
                  ipAddress,
                }
              : {}),

            ...(userAgent !==
            undefined
              ? {
                  userAgent,
                }
              : {}),
          },
        });

        return transcriptAfter;
      },
    );
  };

/**
 * ---------------------------------------------------------
 * GET MY ISSUED TRANSCRIPTS
 * ---------------------------------------------------------
 */

export const getMyIssuedTranscripts =
  async (
    userId: string,
  ) => {
    const student =
      await getStudentByUserId(
        userId,
      );

    return prisma.transcript.findMany({
      where: {
        studentId:
          student.id,

        status:
          "ISSUED",
      },

      orderBy: {
        issuedAt:
          "desc",
      },

      select:
        transcriptSelect,
    });
  };

/**
 * ---------------------------------------------------------
 * REVOKE TRANSCRIPT
 * ---------------------------------------------------------
 *
 * ISSUED → REVOKED
 */

export const revokeTranscript =
  async (
    id: string,
    actorId: string,
    ipAddress?: string,
    userAgent?: string,
  ) => {
    return prisma.$transaction(
      async (tx) => {
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

        if (
          transcript.status !==
          "ISSUED"
        ) {
          throw new AppError(
            `Transcript cannot be revoked from ${transcript.status} status`,
            400,
          );
        }

        const updated =
          await tx.transcript.updateMany({
            where: {
              id,

              status:
                "ISSUED",
            },

            data: {
              status:
                "REVOKED",
            },
          });

        if (
          updated.count !==
          1
        ) {
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

            select:
              transcriptSelect,
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

            action:
              "TRANSCRIPT_REVOKED",

            entity:
              "Transcript",

            entityId:
              transcript.id,

            oldValue: {
              status:
                transcript.status,
            },

            newValue: {
              status:
                "REVOKED",
            },

            ...(ipAddress !==
            undefined
              ? {
                  ipAddress,
                }
              : {}),

            ...(userAgent !==
            undefined
              ? {
                  userAgent,
                }
              : {}),
          },
        });

        return transcriptAfter;
      },
    );
  };

/**
 * ---------------------------------------------------------
 * GET STUDENT TRANSCRIPTS
 * ---------------------------------------------------------
 *
 * ADMIN ONLY
 */

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
      (page - 1) *
      limit;

    const where:
      Prisma.TranscriptWhereInput =
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

    const [
      items,
      total,
    ] =
      await prisma.$transaction([
        prisma.transcript.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt:
              sortOrder,
          },

          select:
            transcriptSelect,
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

        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  };


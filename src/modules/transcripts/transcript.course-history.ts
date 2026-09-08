import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";

export const getStudentCourseHistory =
  async (userId: string) => {
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
          program: {
            select: {
              id: true,
              code: true,
              name: true,
              degree: true,
            },
          },
        },
      });

    if (!student) {
      throw new AppError(
        "Student profile not found",
        404,
      );
    }

    const results =
      await prisma.result.findMany({
        where: {
          status: "PUBLISHED",
          enrollment: {
            studentId: student.id,
          },
        },
        select: {
          id: true,
          grade: true,
          gradePoint: true,
          marksObtained: true,

          enrollment: {
            select: {
              section: {
                select: {
                  sectionCode: true,

                  courseOffering: {
                    select: {
                      credits: true,

                      course: {
                        select: {
                          id: true,
                          code: true,
                          title: true,
                          courseType: true,
                        },
                      },

                      semester: {
                        select: {
                          id: true,
                          name: true,
                          code: true,
                          type: true,
                          startDate: true,
                          endDate: true,
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
          enrollment: {
            section: {
              courseOffering: {
                semester: {
                  startDate: "desc",
                },
              },
            },
          },
        },
      });

    if (results.length === 0) {
      throw new AppError(
        "No published course history available",
        404,
      );
    }

    return {
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        program: student.program,
      },

      courses: results.map((result) => {
        const offering =
          result.enrollment.section
            .courseOffering;

        const course = offering.course;
        const semester = offering.semester;

        return {
          resultId: result.id,

          course: {
            id: course.id,
            code: course.code,
            title: course.title,
            courseType: course.courseType,
            credits: Number(
              offering.credits,
            ),
          },

          section: {
            code:
              result.enrollment.section
                .sectionCode,
          },

          semester: {
            id: semester.id,
            name: semester.name,
            code: semester.code,
            type: semester.type,
            startDate: semester.startDate,
            endDate: semester.endDate,
          },

          academicResult: {
            marksObtained:
              Number(
                result.marksObtained,
              ),
            grade: result.grade,
            gradePoint:
              result.gradePoint === null
                ? null
                : Number(
                    result.gradePoint,
                  ),
          },
        };
      }),
    };
  };
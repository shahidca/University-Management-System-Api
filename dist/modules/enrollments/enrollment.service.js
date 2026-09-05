import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
/*
 * Maximum number of credits a student can take
 * during one semester.
 *
 * This is intentionally NOT taken from Program.totalCredits.
 * Program.totalCredits represents the total credits required
 * for the entire degree.
 */
const MAX_SEMESTER_CREDITS = 18;
const enrollmentSelect = {
    id: true,
    studentId: true,
    sectionId: true,
    status: true,
    enrolledAt: true,
    droppedAt: true,
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
                },
            },
        },
    },
    section: {
        select: {
            id: true,
            sectionCode: true,
            name: true,
            capacity: true,
            enrolledCount: true,
            isActive: true,
            courseOffering: {
                select: {
                    id: true,
                    code: true,
                    title: true,
                    credits: true,
                    isActive: true,
                    course: {
                        select: {
                            id: true,
                            code: true,
                            title: true,
                            credits: true,
                        },
                    },
                    semester: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            status: true,
                            registrationOpen: true,
                            registrationClose: true,
                        },
                    },
                },
            },
        },
    },
};
/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/
const getStudentByUserId = async (userId) => {
    const student = await prisma.studentProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            programId: true,
            program: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    totalCredits: true,
                    isActive: true,
                    deletedAt: true,
                },
            },
        },
    });
    if (!student) {
        throw new AppError("Student profile not found", 404);
    }
    if (!student.program.isActive ||
        student.program.deletedAt) {
        throw new AppError("Student's academic program is inactive", 400);
    }
    return student;
};
/*
|--------------------------------------------------------------------------
| Section validation
|--------------------------------------------------------------------------
*/
const getSectionForEnrollment = async (sectionId) => {
    const section = await prisma.section.findUnique({
        where: {
            id: sectionId,
        },
        select: {
            id: true,
            sectionCode: true,
            name: true,
            capacity: true,
            enrolledCount: true,
            isActive: true,
            courseOffering: {
                select: {
                    id: true,
                    code: true,
                    title: true,
                    credits: true,
                    isActive: true,
                    course: {
                        select: {
                            id: true,
                            code: true,
                            title: true,
                            credits: true,
                            isActive: true,
                            deletedAt: true,
                        },
                    },
                    semester: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            status: true,
                            registrationOpen: true,
                            registrationClose: true,
                        },
                    },
                },
            },
        },
    });
    if (!section) {
        throw new AppError("Section not found", 404);
    }
    if (!section.isActive) {
        throw new AppError("Section is inactive", 400);
    }
    if (!section.courseOffering.isActive) {
        throw new AppError("Course offering is inactive", 400);
    }
    if (!section.courseOffering.course.isActive ||
        section.courseOffering.course.deletedAt) {
        throw new AppError("Course is inactive", 400);
    }
    const semester = section.courseOffering.semester;
    if (semester.status !==
        "REGISTRATION_OPEN") {
        throw new AppError("Course registration is not open for this semester", 400);
    }
    const now = new Date();
    if (now < semester.registrationOpen ||
        now > semester.registrationClose) {
        throw new AppError("Course registration is outside the allowed registration window", 400);
    }
    return section;
};
/*
|--------------------------------------------------------------------------
| Grade rules
|--------------------------------------------------------------------------
*/
const GRADE_POINTS = {
    "A+": 4.0,
    A: 3.75,
    "A-": 3.5,
    "B+": 3.25,
    B: 3.0,
    "B-": 2.75,
    "C+": 2.5,
    C: 2.25,
    "C-": 2.0,
    D: 1.0,
    F: 0.0,
};
/*
|--------------------------------------------------------------------------
| Prerequisite validation
|--------------------------------------------------------------------------
*/
const validatePrerequisites = async (studentId, courseId) => {
    const prerequisites = await prisma.coursePrerequisite.findMany({
        where: {
            courseId,
        },
        select: {
            prerequisiteId: true,
            minimumGrade: true,
            prerequisite: {
                select: {
                    id: true,
                    code: true,
                    title: true,
                },
            },
        },
    });
    if (prerequisites.length === 0) {
        return;
    }
    for (const prerequisite of prerequisites) {
        const previousEnrollment = await prisma.enrollment.findFirst({
            where: {
                studentId,
                status: {
                    in: [
                        "ENROLLED",
                        "COMPLETED",
                    ],
                },
                section: {
                    courseOffering: {
                        courseId: prerequisite.prerequisiteId,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            select: {
                id: true,
                status: true,
                results: {
                    where: {
                        status: "PUBLISHED",
                        exam: {
                            examType: "FINAL",
                        },
                    },
                    orderBy: {
                        publishedAt: "desc",
                    },
                    take: 1,
                    select: {
                        id: true,
                        grade: true,
                        gradePoint: true,
                        status: true,
                    },
                },
            },
        });
        if (!previousEnrollment) {
            throw new AppError(`Prerequisite course ${prerequisite.prerequisite.code} - ${prerequisite.prerequisite.title} has not been completed`, 400);
        }
        const finalResult = previousEnrollment.results[0];
        if (!finalResult) {
            throw new AppError(`No published final result found for prerequisite course ${prerequisite.prerequisite.code}`, 400);
        }
        const actualGrade = finalResult.grade
            ?.trim()
            .toUpperCase();
        if (actualGrade === "F") {
            throw new AppError(`Prerequisite course ${prerequisite.prerequisite.code} was not passed`, 400);
        }
        if (!prerequisite.minimumGrade) {
            continue;
        }
        const requiredGrade = prerequisite.minimumGrade
            .trim()
            .toUpperCase();
        const requiredPoint = GRADE_POINTS[requiredGrade];
        const actualPoint = finalResult.gradePoint !== null &&
            finalResult.gradePoint !== undefined
            ? Number(finalResult.gradePoint)
            : actualGrade
                ? GRADE_POINTS[actualGrade]
                : undefined;
        if (requiredPoint === undefined) {
            throw new AppError(`Invalid minimum grade configuration for prerequisite ${prerequisite.prerequisite.code}`, 500);
        }
        if (actualPoint === undefined ||
            actualPoint < requiredPoint) {
            throw new AppError(`Student does not meet the minimum grade requirement for prerequisite course ${prerequisite.prerequisite.code}`, 400, [
                {
                    prerequisiteCourse: prerequisite.prerequisite.code,
                    requiredGrade,
                    actualGrade: actualGrade ?? null,
                    actualGradePoint: actualPoint ?? null,
                },
            ]);
        }
    }
};
/*
|--------------------------------------------------------------------------
| Financial eligibility
|--------------------------------------------------------------------------
|
| A student with an overdue invoice cannot register
| for a new course.
|
*/
const validateFinancialEligibility = async (studentId) => {
    const overdueInvoice = await prisma.invoice.findFirst({
        where: {
            studentId,
            status: "OVERDUE",
        },
        select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            dueDate: true,
        },
    });
    if (!overdueInvoice) {
        return;
    }
    throw new AppError("Course registration is blocked because you have an overdue invoice", 403, [
        {
            invoiceId: overdueInvoice.id,
            invoiceNumber: overdueInvoice.invoiceNumber,
            totalAmount: overdueInvoice.totalAmount,
            dueDate: overdueInvoice.dueDate,
        },
    ]);
};
/*
|--------------------------------------------------------------------------
| Semester credit limit
|--------------------------------------------------------------------------
*/
const validateSemesterCreditLimit = async (studentId, semesterId, newCourseCredits) => {
    const existingEnrollments = await prisma.enrollment.findMany({
        where: {
            studentId,
            status: "ENROLLED",
            section: {
                courseOffering: {
                    semesterId,
                },
            },
        },
        select: {
            section: {
                select: {
                    courseOffering: {
                        select: {
                            credits: true,
                        },
                    },
                },
            },
        },
    });
    const currentCredits = existingEnrollments.reduce((total, enrollment) => {
        return (total +
            Number(enrollment.section
                .courseOffering.credits));
    }, 0);
    const requestedCredits = Number(newCourseCredits);
    const totalCredits = currentCredits + requestedCredits;
    if (totalCredits >
        MAX_SEMESTER_CREDITS) {
        throw new AppError(`Semester credit limit exceeded. Maximum allowed credits are ${MAX_SEMESTER_CREDITS}`, 400, [
            {
                currentCredits,
                requestedCredits,
                totalCredits,
                maximumCredits: MAX_SEMESTER_CREDITS,
            },
        ]);
    }
    return {
        currentCredits,
        requestedCredits,
        totalCredits,
        maximumCredits: MAX_SEMESTER_CREDITS,
    };
};
/*
|--------------------------------------------------------------------------
| Schedule conflict validation
|--------------------------------------------------------------------------
*/
const validateScheduleConflicts = async (studentId, sectionId, semesterId) => {
    const targetSchedules = await prisma.sectionSchedule.findMany({
        where: {
            sectionId,
        },
        select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            room: true,
            building: true,
        },
    });
    /*
     * A section without a schedule cannot currently
     * create a schedule conflict.
     */
    if (targetSchedules.length === 0) {
        return;
    }
    const existingEnrollments = await prisma.enrollment.findMany({
        where: {
            studentId,
            status: "ENROLLED",
            section: {
                courseOffering: {
                    semesterId,
                },
            },
        },
        select: {
            id: true,
            section: {
                select: {
                    id: true,
                    sectionCode: true,
                    name: true,
                    courseOffering: {
                        select: {
                            code: true,
                            title: true,
                            course: {
                                select: {
                                    code: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    schedules: {
                        select: {
                            id: true,
                            dayOfWeek: true,
                            startTime: true,
                            endTime: true,
                            room: true,
                            building: true,
                        },
                    },
                },
            },
        },
    });
    for (const existingEnrollment of existingEnrollments) {
        for (const existingSchedule of existingEnrollment
            .section.schedules) {
            for (const targetSchedule of targetSchedules) {
                if (existingSchedule.dayOfWeek !==
                    targetSchedule.dayOfWeek) {
                    continue;
                }
                /*
                 * Time overlap:
                 *
                 * existing.start < target.end
                 * AND
                 * existing.end > target.start
                 *
                 * This handles partial and complete overlap.
                 */
                const hasOverlap = existingSchedule.startTime <
                    targetSchedule.endTime &&
                    existingSchedule.endTime >
                        targetSchedule.startTime;
                if (!hasOverlap) {
                    continue;
                }
                throw new AppError("Schedule conflict detected with an already enrolled course", 409, [
                    {
                        existingCourse: existingEnrollment.section
                            .courseOffering.course.code,
                        existingCourseTitle: existingEnrollment.section
                            .courseOffering.course.title,
                        existingSection: existingEnrollment.section
                            .sectionCode,
                        existingDayOfWeek: existingSchedule.dayOfWeek,
                        existingStartTime: existingSchedule.startTime,
                        existingEndTime: existingSchedule.endTime,
                        requestedDayOfWeek: targetSchedule.dayOfWeek,
                        requestedStartTime: targetSchedule.startTime,
                        requestedEndTime: targetSchedule.endTime,
                    },
                ]);
            }
        }
    }
};
/*
|--------------------------------------------------------------------------
| Create enrollment
|--------------------------------------------------------------------------
*/
export const createEnrollment = async (userId, input) => {
    const student = await getStudentByUserId(userId);
    const section = await getSectionForEnrollment(input.sectionId);
    const semesterId = section.courseOffering.semester.id;
    const courseId = section.courseOffering.course.id;
    const courseCredits = section.courseOffering.credits;
    /*
     * Prevent the student from enrolling in the
     * same section more than once.
     *
     * The database unique constraint is still
     * the final protection against concurrent requests.
     */
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_sectionId: {
                studentId: student.id,
                sectionId: section.id,
            },
        },
        select: {
            id: true,
            status: true,
        },
    });
    if (existingEnrollment) {
        throw new AppError(`Student already has an enrollment for this section with status ${existingEnrollment.status}`, 409);
    }
    /*
     * Financial restriction.
     */
    await validateFinancialEligibility(student.id);
    /*
     * Prerequisite validation.
     */
    await validatePrerequisites(student.id, courseId);
    /*
     * Semester credit limit.
     */
    await validateSemesterCreditLimit(student.id, semesterId, courseCredits);
    /*
     * Student schedule conflict.
     */
    await validateScheduleConflicts(student.id, section.id, semesterId);
    try {
        const enrollment = await prisma.$transaction(async (tx) => {
            /*
             * Atomically reserve one seat.
             *
             * This prevents two concurrent requests
             * from exceeding section capacity.
             */
            const capacityUpdate = await tx.section.updateMany({
                where: {
                    id: section.id,
                    isActive: true,
                    enrolledCount: {
                        lt: section.capacity,
                    },
                },
                data: {
                    enrolledCount: {
                        increment: 1,
                    },
                },
            });
            if (capacityUpdate.count !== 1) {
                throw new AppError("Section is full", 409);
            }
            try {
                return await tx.enrollment.create({
                    data: {
                        studentId: student.id,
                        sectionId: section.id,
                        status: "ENROLLED",
                        enrolledAt: new Date(),
                    },
                    select: enrollmentSelect,
                });
            }
            catch (error) {
                /*
                 * P2002 means the unique
                 * studentId + sectionId constraint
                 * was violated.
                 *
                 * Because this occurs inside the
                 * transaction, the seat increment
                 * is rolled back automatically.
                 */
                if (error instanceof
                    Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002") {
                    throw new AppError("Student is already enrolled in this section", 409);
                }
                throw error;
            }
        });
        return enrollment;
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw error;
    }
};
/*
|--------------------------------------------------------------------------
| Get enrollments
|--------------------------------------------------------------------------
*/
export const getEnrollments = async (query) => {
    const { page, limit, studentId, sectionId, status, sortBy, sortOrder, } = query;
    const where = {
        ...(studentId
            ? {
                studentId,
            }
            : {}),
        ...(sectionId
            ? {
                sectionId,
            }
            : {}),
        ...(status
            ? {
                status,
            }
            : {}),
    };
    const skip = (page - 1) * limit;
    const orderBy = {
        [sortBy]: sortOrder,
    };
    const [items, total,] = await prisma.$transaction([
        prisma.enrollment.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            select: enrollmentSelect,
        }),
        prisma.enrollment.count({
            where,
        }),
    ]);
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
/*
|--------------------------------------------------------------------------
| Get enrollment by ID
|--------------------------------------------------------------------------
*/
export const getEnrollmentById = async (id) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id,
        },
        select: enrollmentSelect,
    });
    if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
    }
    return enrollment;
};
/*
|--------------------------------------------------------------------------
| Drop enrollment
|--------------------------------------------------------------------------
*/
export const dropEnrollment = async (userId, id) => {
    const student = await getStudentByUserId(userId);
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            studentId: true,
            sectionId: true,
            status: true,
            section: {
                select: {
                    id: true,
                    enrolledCount: true,
                    courseOffering: {
                        select: {
                            semester: {
                                select: {
                                    status: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
    }
    if (enrollment.studentId !==
        student.id) {
        throw new AppError("You do not have permission to modify this enrollment", 403);
    }
    if (enrollment.status !== "ENROLLED") {
        throw new AppError(`Enrollment cannot be dropped from its current status: ${enrollment.status}`, 400);
    }
    if (enrollment.section
        .courseOffering.semester.status ===
        "COMPLETED") {
        throw new AppError("Enrollment cannot be dropped after the semester is completed", 400);
    }
    return prisma.$transaction(async (tx) => {
        const updated = await tx.enrollment.update({
            where: {
                id,
            },
            data: {
                status: "DROPPED",
                droppedAt: new Date(),
            },
            select: {
                id: true,
                studentId: true,
                sectionId: true,
                status: true,
                enrolledAt: true,
                droppedAt: true,
            },
        });
        /*
         * Safely decrement the section count.
         *
         * The condition prevents enrolledCount
         * from becoming negative.
         */
        await tx.section.updateMany({
            where: {
                id: enrollment.sectionId,
                enrolledCount: {
                    gt: 0,
                },
            },
            data: {
                enrolledCount: {
                    decrement: 1,
                },
            },
        });
        return updated;
    });
};
/*
|--------------------------------------------------------------------------
| Get current student's enrollments
|--------------------------------------------------------------------------
*/
export const getMyEnrollments = async (userId, query) => {
    const student = await getStudentByUserId(userId);
    return getEnrollments({
        ...query,
        studentId: student.id,
    });
};
//# sourceMappingURL=enrollment.service.js.map
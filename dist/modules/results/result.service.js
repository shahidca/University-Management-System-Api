import { Prisma } from "@prisma/client";
import { calculateCgpa, calculateGpa, } from "./result.gpa.js";
import { calculateCourseGrade, } from "./result.course-grade.js";
import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
const resultSelect = {
    id: true,
    examId: true,
    enrollmentId: true,
    marksObtained: true,
    grade: true,
    gradePoint: true,
    status: true,
    remarks: true,
    submittedAt: true,
    approvedAt: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    exam: {
        select: {
            id: true,
            title: true,
            examType: true,
            totalMarks: true,
            examDate: true,
            startTime: true,
            endTime: true,
            room: true,
            isPublished: true,
            section: {
                select: {
                    id: true,
                    sectionCode: true,
                    name: true,
                    instructorId: true,
                    courseOffering: {
                        select: {
                            id: true,
                            code: true,
                            title: true,
                            credits: true,
                            course: {
                                select: {
                                    id: true,
                                    code: true,
                                    title: true,
                                    credits: true,
                                    courseType: true,
                                    level: true,
                                },
                            },
                            semester: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                    status: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    enrollment: {
        select: {
            id: true,
            studentId: true,
            sectionId: true,
            status: true,
            enrolledAt: true,
            droppedAt: true,
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
            section: {
                select: {
                    id: true,
                    sectionCode: true,
                    name: true,
                },
            },
        },
    },
};
/**
 * ---------------------------------------------------------
 * GRADING
 * ---------------------------------------------------------
 *
 * The client never controls grade or gradePoint.
 * Both values are calculated on the server.
 *
 * Current UniCore grading scale:
 *
 * 80-100 -> A+ -> 4.00
 * 75-79  -> A  -> 3.75
 * 70-74  -> A- -> 3.50
 * 65-69  -> B+ -> 3.25
 * 60-64  -> B  -> 3.00
 * 55-59  -> B- -> 2.75
 * 50-54  -> C+ -> 2.50
 * 45-49  -> C  -> 2.25
 * 40-44  -> D  -> 2.00
 * 0-39   -> F  -> 0.00
 *
 * NOTE:
 * This grading scale should be replaced/configured when
 * the official university grading policy is finalized.
 */
const calculateGrade = (marks) => {
    if (marks >= 80) {
        return {
            grade: "A+",
            gradePoint: 4.0,
        };
    }
    if (marks >= 75) {
        return {
            grade: "A",
            gradePoint: 3.75,
        };
    }
    if (marks >= 70) {
        return {
            grade: "A-",
            gradePoint: 3.5,
        };
    }
    if (marks >= 65) {
        return {
            grade: "B+",
            gradePoint: 3.25,
        };
    }
    if (marks >= 60) {
        return {
            grade: "B",
            gradePoint: 3.0,
        };
    }
    if (marks >= 55) {
        return {
            grade: "B-",
            gradePoint: 2.75,
        };
    }
    if (marks >= 50) {
        return {
            grade: "C+",
            gradePoint: 2.5,
        };
    }
    if (marks >= 45) {
        return {
            grade: "C",
            gradePoint: 2.25,
        };
    }
    if (marks >= 40) {
        return {
            grade: "D",
            gradePoint: 2.0,
        };
    }
    return {
        grade: "F",
        gradePoint: 0,
    };
};
/**
 * ---------------------------------------------------------
 * INSTRUCTOR
 * ---------------------------------------------------------
 */
const getInstructorByUserId = async (userId) => {
    const instructor = await prisma.instructorProfile.findUnique({
        where: {
            userId,
        },
        select: {
            id: true,
            userId: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            designation: true,
            isActive: true,
        },
    });
    if (!instructor) {
        throw new AppError("Instructor profile not found", 404);
    }
    if (!instructor.isActive) {
        throw new AppError("Instructor account is inactive", 403);
    }
    return instructor;
};
/**
 * ---------------------------------------------------------
 * EXAM + ENROLLMENT VALIDATION
 * ---------------------------------------------------------
 */
const getExamAndEnrollment = async (examId, enrollmentId) => {
    const exam = await prisma.exam.findUnique({
        where: {
            id: examId,
        },
        select: {
            id: true,
            title: true,
            totalMarks: true,
            isPublished: true,
            section: {
                select: {
                    id: true,
                    instructorId: true,
                    isActive: true,
                    courseOffering: {
                        select: {
                            id: true,
                            isActive: true,
                            course: {
                                select: {
                                    id: true,
                                    isActive: true,
                                    deletedAt: true,
                                },
                            },
                            semester: {
                                select: {
                                    id: true,
                                    status: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!exam) {
        throw new AppError("Exam not found", 404);
    }
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId,
        },
        select: {
            id: true,
            studentId: true,
            sectionId: true,
            status: true,
        },
    });
    if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
    }
    if (enrollment.sectionId !==
        exam.section.id) {
        throw new AppError("Exam and enrollment belong to different sections", 400);
    }
    return {
        exam,
        enrollment,
    };
};
/**
 * ---------------------------------------------------------
 * ACADEMIC STATE VALIDATION
 * ---------------------------------------------------------
 */
const validateAcademicState = ({ sectionActive, offeringActive, courseActive, courseDeletedAt, semesterStatus, }) => {
    if (!sectionActive) {
        throw new AppError("Section is inactive", 400);
    }
    if (!offeringActive) {
        throw new AppError("Course offering is inactive", 400);
    }
    if (!courseActive ||
        courseDeletedAt) {
        throw new AppError("Course is inactive or deleted", 400);
    }
    if (semesterStatus ===
        "COMPLETED") {
        throw new AppError("Cannot manage results for a completed semester", 400);
    }
};
/**
 * ---------------------------------------------------------
 * MARKS VALIDATION
 * ---------------------------------------------------------
 */
const validateMarks = (marksObtained, totalMarks) => {
    if (marksObtained < 0) {
        throw new AppError("Marks obtained cannot be negative", 400);
    }
    const maximumMarks = totalMarks.toNumber();
    if (marksObtained >
        maximumMarks) {
        throw new AppError(`Marks obtained cannot exceed ${maximumMarks}`, 400);
    }
};
/**
 * ---------------------------------------------------------
 * ENROLLMENT VALIDATION
 * ---------------------------------------------------------
 */
const ensureEnrollmentIsValid = (status) => {
    if (status !== "ENROLLED") {
        throw new AppError("Results can only be recorded for an enrolled student", 400);
    }
};
/**
 * ---------------------------------------------------------
 * CREATE RESULT
 * ---------------------------------------------------------
 */
export const createResult = async (userId, input) => {
    const instructor = await getInstructorByUserId(userId);
    const { exam, enrollment, } = await getExamAndEnrollment(input.examId, input.enrollmentId);
    validateAcademicState({
        sectionActive: exam.section.isActive,
        offeringActive: exam.section
            .courseOffering
            .isActive,
        courseActive: exam.section
            .courseOffering
            .course
            .isActive,
        courseDeletedAt: exam.section
            .courseOffering
            .course
            .deletedAt,
        semesterStatus: exam.section
            .courseOffering
            .semester
            .status,
    });
    if (exam.section.instructorId !==
        instructor.id) {
        throw new AppError("You are not assigned to this section", 403);
    }
    if (!exam.isPublished) {
        throw new AppError("Results cannot be recorded before the exam is published", 400);
    }
    ensureEnrollmentIsValid(enrollment.status);
    validateMarks(input.marksObtained, exam.totalMarks);
    const existingResult = await prisma.result.findUnique({
        where: {
            examId_enrollmentId: {
                examId: input.examId,
                enrollmentId: input.enrollmentId,
            },
        },
        select: {
            id: true,
        },
    });
    if (existingResult) {
        throw new AppError("A result already exists for this exam and enrollment", 409);
    }
    const { grade, gradePoint, } = calculateGrade(input.marksObtained);
    try {
        return await prisma.result.create({
            data: {
                examId: input.examId,
                enrollmentId: input.enrollmentId,
                marksObtained: new Prisma.Decimal(input.marksObtained),
                grade,
                gradePoint: new Prisma.Decimal(gradePoint),
                status: "DRAFT",
                ...(input.remarks !==
                    undefined
                    ? {
                        remarks: input.remarks,
                    }
                    : {}),
            },
            select: resultSelect,
        });
    }
    catch (error) {
        if (error instanceof
            Prisma.PrismaClientKnownRequestError) {
            if (error.code ===
                "P2002") {
                throw new AppError("A result already exists for this exam and enrollment", 409);
            }
        }
        throw error;
    }
};
/**
 * ---------------------------------------------------------
 * GET RESULT BY ID
 * ---------------------------------------------------------
 */
export const getResultById = async (userId, role, id) => {
    const where = {
        id,
    };
    /**
     * Students can only access
     * their own published results.
     */
    if (role === "STUDENT") {
        where.status =
            "PUBLISHED";
        where.enrollment = {
            student: {
                userId,
            },
        };
    }
    /**
     * Instructors can only access
     * results from their own sections.
     */
    if (role === "INSTRUCTOR") {
        where.enrollment = {
            section: {
                instructor: {
                    userId,
                },
            },
        };
    }
    const result = await prisma.result.findFirst({
        where,
        select: resultSelect,
    });
    if (!result) {
        throw new AppError("Result not found", 404);
    }
    return result;
};
/**
 * ---------------------------------------------------------
 * GET RESULTS
 * ---------------------------------------------------------
 */
export const getResults = async (userId, role, query) => {
    const { page, limit, examId, enrollmentId, studentId, sectionId, status, grade, search, sortBy, sortOrder, } = query;
    const skip = (page - 1) *
        limit;
    const enrollmentWhere = {
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
    };
    if (role === "STUDENT") {
        enrollmentWhere.student = {
            userId,
        };
    }
    if (role === "INSTRUCTOR") {
        enrollmentWhere.section = {
            instructor: {
                userId,
            },
        };
    }
    const where = {
        ...(examId
            ? {
                examId,
            }
            : {}),
        ...(enrollmentId
            ? {
                enrollmentId,
            }
            : {}),
        ...(Object.keys(enrollmentWhere).length > 0
            ? {
                enrollment: enrollmentWhere,
            }
            : {}),
        ...(status
            ? {
                status,
            }
            : {}),
        ...(grade
            ? {
                grade: {
                    equals: grade,
                    mode: "insensitive",
                },
            }
            : {}),
        ...(search
            ? {
                OR: [
                    {
                        remarks: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        enrollment: {
                            student: {
                                OR: [
                                    {
                                        studentId: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                    {
                                        firstName: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                    {
                                        lastName: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            }
            : {}),
    };
    /**
     * Students can only see published results.
     *
     * This intentionally overrides any status
     * supplied through the query string.
     */
    if (role === "STUDENT") {
        where.status =
            "PUBLISHED";
    }
    const [results, total,] = await prisma.$transaction([
        prisma.result.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: resultSelect,
        }),
        prisma.result.count({
            where,
        }),
    ]);
    return {
        items: results,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
/**
 * ---------------------------------------------------------
 * UPDATE RESULT
 * ---------------------------------------------------------
 */
export const updateResult = async (userId, resultId, input) => {
    const instructor = await getInstructorByUserId(userId);
    const existingResult = await prisma.result.findUnique({
        where: {
            id: resultId,
        },
        select: {
            id: true,
            marksObtained: true,
            remarks: true,
            status: true,
            exam: {
                select: {
                    id: true,
                    totalMarks: true,
                    isPublished: true,
                    section: {
                        select: {
                            instructorId: true,
                            isActive: true,
                            courseOffering: {
                                select: {
                                    isActive: true,
                                    course: {
                                        select: {
                                            isActive: true,
                                            deletedAt: true,
                                        },
                                    },
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
            },
        },
    });
    if (!existingResult) {
        throw new AppError("Result not found", 404);
    }
    if (existingResult.exam
        .section
        .instructorId !==
        instructor.id) {
        throw new AppError("You are not assigned to this section", 403);
    }
    validateAcademicState({
        sectionActive: existingResult.exam
            .section
            .isActive,
        offeringActive: existingResult.exam
            .section
            .courseOffering
            .isActive,
        courseActive: existingResult.exam
            .section
            .courseOffering
            .course
            .isActive,
        courseDeletedAt: existingResult.exam
            .section
            .courseOffering
            .course
            .deletedAt,
        semesterStatus: existingResult.exam
            .section
            .courseOffering
            .semester
            .status,
    });
    if (!existingResult.exam
        .isPublished) {
        throw new AppError("The related exam is not published", 400);
    }
    if (existingResult.status !==
        "DRAFT") {
        throw new AppError("Only draft results can be edited", 400);
    }
    const marksObtained = input.marksObtained ??
        existingResult.marksObtained.toNumber();
    validateMarks(marksObtained, existingResult.exam
        .totalMarks);
    const { grade, gradePoint, } = calculateGrade(marksObtained);
    return prisma.result.update({
        where: {
            id: resultId,
        },
        data: {
            marksObtained: new Prisma.Decimal(marksObtained),
            grade,
            gradePoint: new Prisma.Decimal(gradePoint),
            ...(input.remarks !==
                undefined
                ? {
                    remarks: input.remarks,
                }
                : {}),
        },
        select: resultSelect,
    });
};
/**
 * ---------------------------------------------------------
 * SUBMIT RESULT
 * ---------------------------------------------------------
 */
export const submitResult = async (userId, resultId) => {
    const instructor = await getInstructorByUserId(userId);
    const result = await prisma.result.findUnique({
        where: {
            id: resultId,
        },
        select: {
            id: true,
            status: true,
            exam: {
                select: {
                    isPublished: true,
                    section: {
                        select: {
                            instructorId: true,
                            isActive: true,
                            courseOffering: {
                                select: {
                                    isActive: true,
                                    course: {
                                        select: {
                                            isActive: true,
                                            deletedAt: true,
                                        },
                                    },
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
            },
        },
    });
    if (!result) {
        throw new AppError("Result not found", 404);
    }
    if (result.exam.section
        .instructorId !==
        instructor.id) {
        throw new AppError("You are not assigned to this section", 403);
    }
    validateAcademicState({
        sectionActive: result.exam.section
            .isActive,
        offeringActive: result.exam.section
            .courseOffering
            .isActive,
        courseActive: result.exam.section
            .courseOffering.course
            .isActive,
        courseDeletedAt: result.exam.section
            .courseOffering.course
            .deletedAt,
        semesterStatus: result.exam.section
            .courseOffering.semester
            .status,
    });
    if (!result.exam.isPublished) {
        throw new AppError("The related exam is not published", 400);
    }
    if (result.status !==
        "DRAFT") {
        throw new AppError("Only draft results can be submitted", 400);
    }
    return prisma.result.update({
        where: {
            id: resultId,
        },
        data: {
            status: "SUBMITTED",
            submittedAt: new Date(),
        },
        select: resultSelect,
    });
};
/**
 * ---------------------------------------------------------
 * APPROVE RESULT
 * ---------------------------------------------------------
 */
export const approveResult = async (resultId) => {
    const result = await prisma.result.findUnique({
        where: {
            id: resultId,
        },
        select: {
            id: true,
            status: true,
            exam: {
                select: {
                    isPublished: true,
                    section: {
                        select: {
                            isActive: true,
                            courseOffering: {
                                select: {
                                    isActive: true,
                                    course: {
                                        select: {
                                            isActive: true,
                                            deletedAt: true,
                                        },
                                    },
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
            },
        },
    });
    if (!result) {
        throw new AppError("Result not found", 404);
    }
    if (result.status !==
        "SUBMITTED") {
        throw new AppError("Only submitted results can be approved", 400);
    }
    validateAcademicState({
        sectionActive: result.exam.section
            .isActive,
        offeringActive: result.exam.section
            .courseOffering
            .isActive,
        courseActive: result.exam.section
            .courseOffering.course
            .isActive,
        courseDeletedAt: result.exam.section
            .courseOffering.course
            .deletedAt,
        semesterStatus: result.exam.section
            .courseOffering.semester
            .status,
    });
    if (!result.exam.isPublished) {
        throw new AppError("The related exam is not published", 400);
    }
    return prisma.result.update({
        where: {
            id: resultId,
        },
        data: {
            status: "APPROVED",
            approvedAt: new Date(),
        },
        select: resultSelect,
    });
};
/**
 * ---------------------------------------------------------
 * PUBLISH RESULT
 * ---------------------------------------------------------
 */
export const publishResult = async (resultId) => {
    const result = await prisma.result.findUnique({
        where: {
            id: resultId,
        },
        select: {
            id: true,
            status: true,
            exam: {
                select: {
                    isPublished: true,
                    section: {
                        select: {
                            isActive: true,
                            courseOffering: {
                                select: {
                                    isActive: true,
                                    course: {
                                        select: {
                                            isActive: true,
                                            deletedAt: true,
                                        },
                                    },
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
            },
        },
    });
    if (!result) {
        throw new AppError("Result not found", 404);
    }
    if (result.status !==
        "APPROVED") {
        throw new AppError("Only approved results can be published", 400);
    }
    validateAcademicState({
        sectionActive: result.exam.section
            .isActive,
        offeringActive: result.exam.section
            .courseOffering
            .isActive,
        courseActive: result.exam.section
            .courseOffering.course
            .isActive,
        courseDeletedAt: result.exam.section
            .courseOffering.course
            .deletedAt,
        semesterStatus: result.exam.section
            .courseOffering.semester
            .status,
    });
    if (!result.exam.isPublished) {
        throw new AppError("The related exam is not published", 400);
    }
    return prisma.result.update({
        where: {
            id: resultId,
        },
        data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
        },
        select: resultSelect,
    });
};
/**
 * ---------------------------------------------------------
 * STUDENT HELPER
 * ---------------------------------------------------------
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
        },
    });
    if (!student) {
        throw new AppError("Student profile not found", 404);
    }
    return student;
};
const buildCourseGrade = (course) => {
    const calculation = calculateCourseGrade(course.exams);
    return {
        semesterId: course.semesterId,
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        credits: course.credits,
        grade: calculation.grade,
        gradePoint: calculation.gradePoint,
        percentage: calculation.percentage,
        totalMarksObtained: calculation.totalMarksObtained,
        totalMarks: calculation.totalMarks,
        exams: calculation.examResults,
    };
};
/**
 * ---------------------------------------------------------
 * GET STUDENT SEMESTER GPA
 * ---------------------------------------------------------
 */
export const getStudentSemesterGpa = async (userId, semesterId) => {
    const student = await getStudentByUserId(userId);
    const semester = await prisma.semester.findUnique({
        where: {
            id: semesterId,
        },
        select: {
            id: true,
            name: true,
            code: true,
        },
    });
    if (!semester) {
        throw new AppError("Semester not found", 404);
    }
    const results = await prisma.result.findMany({
        where: {
            status: "PUBLISHED",
            enrollment: {
                studentId: student.id,
                status: {
                    in: [
                        "ENROLLED",
                        "COMPLETED",
                    ],
                },
                section: {
                    courseOffering: {
                        semesterId,
                    },
                },
            },
            exam: {
                section: {
                    courseOffering: {
                        semesterId,
                    },
                },
            },
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
    if (results.length === 0) {
        throw new AppError("No published results found for this semester", 404);
    }
    const groupedCourses = new Map();
    for (const result of results) {
        const offering = result.exam.section
            .courseOffering;
        const key = offering.courseId;
        const examResult = {
            examId: result.exam.id,
            examType: result.exam
                .examType,
            marksObtained: Number(result.marksObtained),
            totalMarks: Number(result.exam
                .totalMarks),
        };
        const existing = groupedCourses.get(key);
        if (existing) {
            existing.exams.push(examResult);
            continue;
        }
        groupedCourses.set(key, {
            courseId: offering.courseId,
            semesterId,
            courseCode: offering.course
                .code,
            courseTitle: offering.course
                .title,
            credits: Number(offering.credits),
            exams: [
                examResult,
            ],
        });
    }
    const courses = Array.from(groupedCourses.values()).map(buildCourseGrade);
    const gpaCourses = courses.map((course) => ({
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        credits: course.credits,
        grade: course.grade,
        gradePoint: course.gradePoint,
    }));
    const calculation = calculateGpa(gpaCourses);
    return {
        student: {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
        },
        semester,
        ...calculation,
        courses,
    };
};
/**
 * ---------------------------------------------------------
 * GET STUDENT CGPA
 * ---------------------------------------------------------
 *
 * Important:
 *
 * CGPA must count each course only once per semester.
 *
 * Example:
 *
 * Semester 1:
 *   CSE101 → one course
 *
 * Semester 2:
 *   CSE101 → another course attempt
 *
 * These are two academic records because they belong to
 * different semesters.
 *
 * Multiple exams inside the same course/semester are
 * aggregated into ONE course result.
 */
export const getStudentCgpa = async (userId) => {
    const student = await getStudentByUserId(userId);
    const results = await prisma.result.findMany({
        where: {
            status: "PUBLISHED",
            enrollment: {
                studentId: student.id,
                status: {
                    in: [
                        "ENROLLED",
                        "COMPLETED",
                    ],
                },
            },
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
                                    semesterId: true,
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
    if (results.length === 0) {
        throw new AppError("No published results found for CGPA calculation", 404);
    }
    const groupedCourses = new Map();
    for (const result of results) {
        const offering = result.exam.section
            .courseOffering;
        /**
         * Course + semester is the academic identity
         * for this aggregation.
         */
        const key = `${offering.semesterId}:${offering.courseId}`;
        const examResult = {
            examId: result.exam.id,
            examType: result.exam
                .examType,
            marksObtained: Number(result.marksObtained),
            totalMarks: Number(result.exam
                .totalMarks),
        };
        const existing = groupedCourses.get(key);
        if (existing) {
            existing.exams.push(examResult);
            continue;
        }
        groupedCourses.set(key, {
            courseId: offering.courseId,
            semesterId: offering.semesterId,
            courseCode: offering.course
                .code,
            courseTitle: offering.course
                .title,
            credits: Number(offering.credits),
            exams: [
                examResult,
            ],
        });
    }
    const courses = Array.from(groupedCourses.values()).map(buildCourseGrade);
    const gpaCourses = courses.map((course) => ({
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        credits: course.credits,
        grade: course.grade,
        gradePoint: course.gradePoint,
    }));
    const calculation = calculateCgpa(gpaCourses);
    return {
        student: {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
        },
        ...calculation,
        courses,
    };
};
//# sourceMappingURL=result.service.js.map
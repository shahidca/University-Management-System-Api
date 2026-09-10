import { prisma } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { calculateGpa, calculateCgpa, } from "../results/result.gpa.js";
export const getStudentAcademicHistory = async (userId) => {
    const student = await prisma.studentProfile.findUnique({
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
        throw new AppError("Student profile not found", 404);
    }
    const results = await prisma.result.findMany({
        where: {
            status: "PUBLISHED",
            enrollment: {
                studentId: student.id,
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
                            startDate: "asc",
                        },
                    },
                },
            },
        },
    });
    if (results.length === 0) {
        throw new AppError("No published academic results available", 404);
    }
    const semesterMap = new Map();
    for (const result of results) {
        if (!result.grade ||
            result.gradePoint === null) {
            continue;
        }
        const offering = result.enrollment.section
            .courseOffering;
        const semester = offering.semester;
        const course = offering.course;
        const courseResult = {
            courseId: course.id,
            courseCode: course.code,
            courseTitle: course.title,
            credits: Number(offering.credits),
            grade: result.grade,
            gradePoint: Number(result.gradePoint),
        };
        const existing = semesterMap.get(semester.id);
        if (existing) {
            existing.courses.push(courseResult);
        }
        else {
            semesterMap.set(semester.id, {
                semester,
                courses: [courseResult],
            });
        }
    }
    const semesters = Array.from(semesterMap.values());
    const cumulativeCourses = [];
    const semesterHistory = semesters.map(({ semester, courses }) => {
        const semesterCalculation = calculateGpa(courses);
        cumulativeCourses.push(...courses);
        const cumulativeCalculation = calculateCgpa(cumulativeCourses);
        return {
            semester: {
                id: semester.id,
                name: semester.name,
                code: semester.code,
                type: semester.type,
                startDate: semester.startDate,
                endDate: semester.endDate,
            },
            courses,
            semesterGpa: semesterCalculation.gpa,
            semesterCredits: semesterCalculation.totalCredits,
            semesterQualityPoints: semesterCalculation.totalQualityPoints,
            cumulativeGpa: cumulativeCalculation.gpa,
            cumulativeCredits: cumulativeCalculation.totalCredits,
            cumulativeQualityPoints: cumulativeCalculation.totalQualityPoints,
        };
    });
    const overallCalculation = calculateCgpa(cumulativeCourses);
    return {
        student: {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            program: student.program,
        },
        summary: {
            totalSemesters: semesterHistory.length,
            totalCredits: overallCalculation.totalCredits,
            totalQualityPoints: overallCalculation.totalQualityPoints,
            cgpa: overallCalculation.gpa,
        },
        semesters: semesterHistory,
    };
};
//# sourceMappingURL=transcript.history.js.map
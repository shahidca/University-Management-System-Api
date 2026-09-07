import { Prisma } from "@prisma/client";
import type { Role } from "@prisma/client";
import { type GpaCourseResult } from "./result.gpa.js";
import type { CreateResultInput, ResultListQueryInput, UpdateResultInput } from "./result.validation.js";
export declare const createResult: (userId: string, input: CreateResultInput) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const getResultById: (userId: string, role: Role, id: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const getResults: (userId: string, role: Role, query: ResultListQueryInput) => Promise<{
    items: {
        approvedAt: Date | null;
        createdAt: Date;
        enrollment: {
            droppedAt: Date | null;
            enrolledAt: Date | null;
            id: string;
            section: {
                id: string;
                name: string;
                sectionCode: string;
            };
            sectionId: string;
            status: import("@prisma/client").$Enums.EnrollmentStatus;
            student: {
                firstName: string;
                id: string;
                lastName: string;
                program: {
                    code: string;
                    degree: string;
                    id: string;
                    name: string;
                };
                studentId: string;
            };
            studentId: string;
        };
        enrollmentId: string;
        exam: {
            endTime: string | null;
            examDate: Date;
            examType: import("@prisma/client").$Enums.ExamType;
            id: string;
            isPublished: boolean;
            room: string | null;
            section: {
                courseOffering: {
                    code: string;
                    course: {
                        code: string;
                        courseType: import("@prisma/client").$Enums.CourseType;
                        credits: Prisma.Decimal;
                        id: string;
                        level: number;
                        title: string;
                    };
                    credits: Prisma.Decimal;
                    id: string;
                    semester: {
                        code: string;
                        id: string;
                        name: string;
                        status: import("@prisma/client").$Enums.SemesterStatus;
                    };
                    title: string;
                };
                id: string;
                instructorId: string;
                name: string;
                sectionCode: string;
            };
            startTime: string | null;
            title: string;
            totalMarks: Prisma.Decimal;
        };
        examId: string;
        grade: string | null;
        gradePoint: Prisma.Decimal | null;
        id: string;
        marksObtained: Prisma.Decimal;
        publishedAt: Date | null;
        remarks: string | null;
        status: import("@prisma/client").$Enums.ResultStatus;
        submittedAt: Date | null;
        updatedAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const updateResult: (userId: string, resultId: string, input: UpdateResultInput) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const submitResult: (userId: string, resultId: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const approveResult: (resultId: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const publishResult: (resultId: string) => Promise<{
    approvedAt: Date | null;
    createdAt: Date;
    enrollment: {
        droppedAt: Date | null;
        enrolledAt: Date | null;
        id: string;
        section: {
            id: string;
            name: string;
            sectionCode: string;
        };
        sectionId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        student: {
            firstName: string;
            id: string;
            lastName: string;
            program: {
                code: string;
                degree: string;
                id: string;
                name: string;
            };
            studentId: string;
        };
        studentId: string;
    };
    enrollmentId: string;
    exam: {
        endTime: string | null;
        examDate: Date;
        examType: import("@prisma/client").$Enums.ExamType;
        id: string;
        isPublished: boolean;
        room: string | null;
        section: {
            courseOffering: {
                code: string;
                course: {
                    code: string;
                    courseType: import("@prisma/client").$Enums.CourseType;
                    credits: Prisma.Decimal;
                    id: string;
                    level: number;
                    title: string;
                };
                credits: Prisma.Decimal;
                id: string;
                semester: {
                    code: string;
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.SemesterStatus;
                };
                title: string;
            };
            id: string;
            instructorId: string;
            name: string;
            sectionCode: string;
        };
        startTime: string | null;
        title: string;
        totalMarks: Prisma.Decimal;
    };
    examId: string;
    grade: string | null;
    gradePoint: Prisma.Decimal | null;
    id: string;
    marksObtained: Prisma.Decimal;
    publishedAt: Date | null;
    remarks: string | null;
    status: import("@prisma/client").$Enums.ResultStatus;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare const getStudentSemesterGpa: (userId: string, semesterId: string) => Promise<{
    totalCredits: number;
    totalQualityPoints: number;
    gpa: number;
    courses: GpaCourseResult[];
    student: {
        id: string;
        studentId: string;
        firstName: string;
        lastName: string;
    };
    semester: {
        code: string;
        id: string;
        name: string;
    };
}>;
export declare const getStudentCgpa: (userId: string) => Promise<{
    totalCredits: number;
    totalQualityPoints: number;
    gpa: number;
    courses: GpaCourseResult[];
    student: {
        id: string;
        studentId: string;
        firstName: string;
        lastName: string;
    };
}>;
//# sourceMappingURL=result.service.d.ts.map
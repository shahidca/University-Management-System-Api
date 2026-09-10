import { type GpaCourseResult } from "../results/result.gpa.js";
export declare const getStudentAcademicHistory: (userId: string) => Promise<{
    student: {
        id: string;
        studentId: string;
        firstName: string;
        lastName: string;
        program: {
            code: string;
            degree: string;
            id: string;
            name: string;
        };
    };
    summary: {
        totalSemesters: number;
        totalCredits: number;
        totalQualityPoints: number;
        cgpa: number;
    };
    semesters: {
        semester: {
            id: string;
            name: string;
            code: string;
            type: string;
            startDate: Date;
            endDate: Date;
        };
        courses: GpaCourseResult[];
        semesterGpa: number;
        semesterCredits: number;
        semesterQualityPoints: number;
        cumulativeGpa: number;
        cumulativeCredits: number;
        cumulativeQualityPoints: number;
    }[];
}>;
//# sourceMappingURL=transcript.history.d.ts.map
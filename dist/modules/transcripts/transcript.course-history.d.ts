export declare const getStudentCourseHistory: (userId: string) => Promise<{
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
    courses: {
        resultId: string;
        course: {
            id: string;
            code: string;
            title: string;
            courseType: import("@prisma/client").$Enums.CourseType;
            credits: number;
        };
        section: {
            code: string;
        };
        semester: {
            id: string;
            name: string;
            code: string;
            type: import("@prisma/client").$Enums.SemesterType;
            startDate: Date;
            endDate: Date;
        };
        academicResult: {
            marksObtained: number;
            grade: string | null;
            gradePoint: number | null;
        };
    }[];
}>;
//# sourceMappingURL=transcript.course-history.d.ts.map
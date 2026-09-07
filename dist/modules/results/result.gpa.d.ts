export interface GpaCourseResult {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    grade: string;
    gradePoint: number;
}
export interface GpaCalculation {
    totalCredits: number;
    totalQualityPoints: number;
    gpa: number;
    courses: GpaCourseResult[];
}
export declare const calculateGpa: (results: GpaCourseResult[]) => GpaCalculation;
export declare const calculateCgpa: (results: GpaCourseResult[]) => GpaCalculation;
//# sourceMappingURL=result.gpa.d.ts.map
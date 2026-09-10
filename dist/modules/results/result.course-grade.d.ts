export interface ExamResultInput {
    examId: string;
    examType: string;
    marksObtained: number;
    totalMarks: number;
}
export interface CourseGradeCalculation {
    totalMarksObtained: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    gradePoint: number;
    examResults: ExamResultInput[];
}
export declare const calculateCourseGrade: (results: ExamResultInput[]) => CourseGradeCalculation;
//# sourceMappingURL=result.course-grade.d.ts.map
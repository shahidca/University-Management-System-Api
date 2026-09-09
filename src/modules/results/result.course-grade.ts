import { AppError } from "../../utils/app-error.js";

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

const roundToTwo = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const calculateCourseGrade = (
  results: ExamResultInput[],
): CourseGradeCalculation => {
  if (results.length === 0) {
    throw new AppError(
      "No published exam results available",
      404,
    );
  }

  const totalMarks = results.reduce(
    (sum, result) => sum + result.totalMarks,
    0,
  );

  const totalMarksObtained = results.reduce(
    (sum, result) => sum + result.marksObtained,
    0,
  );

  if (totalMarks <= 0) {
    throw new AppError(
      "Course grade cannot be calculated because total marks are zero",
      400,
    );
  }

  const percentage =
    (totalMarksObtained / totalMarks) * 100;

  let grade: string;
  let gradePoint: number;

  if (percentage >= 80) {
    grade = "A+";
    gradePoint = 4.0;
  } else if (percentage >= 75) {
    grade = "A";
    gradePoint = 3.75;
  } else if (percentage >= 70) {
    grade = "A-";
    gradePoint = 3.5;
  } else if (percentage >= 65) {
    grade = "B+";
    gradePoint = 3.25;
  } else if (percentage >= 60) {
    grade = "B";
    gradePoint = 3.0;
  } else if (percentage >= 55) {
    grade = "B-";
    gradePoint = 2.75;
  } else if (percentage >= 50) {
    grade = "C+";
    gradePoint = 2.5;
  } else if (percentage >= 45) {
    grade = "C";
    gradePoint = 2.25;
  } else if (percentage >= 40) {
    grade = "D";
    gradePoint = 2.0;
  } else {
    grade = "F";
    gradePoint = 0.0;
  }

  return {
    totalMarksObtained: roundToTwo(totalMarksObtained),
    totalMarks: roundToTwo(totalMarks),
    percentage: roundToTwo(percentage),
    grade,
    gradePoint,
    examResults: results,
  };
};
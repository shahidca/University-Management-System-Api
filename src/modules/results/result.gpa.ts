import { AppError } from "../../utils/app-error.js";

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

const roundToTwo = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const calculateGpa = (
  results: GpaCourseResult[],
): GpaCalculation => {
  if (results.length === 0) {
    throw new AppError(
      "No published results available for GPA calculation",
      404,
    );
  }

  const totalCredits = results.reduce(
    (sum, result) => sum + result.credits,
    0,
  );

  if (totalCredits <= 0) {
    throw new AppError(
      "GPA cannot be calculated because total credits are zero",
      400,
    );
  }

  const totalQualityPoints = results.reduce(
    (sum, result) =>
      sum + result.gradePoint * result.credits,
    0,
  );

  const gpa =
    totalQualityPoints / totalCredits;

  return {
    totalCredits: roundToTwo(totalCredits),
    totalQualityPoints:
      roundToTwo(totalQualityPoints),
    gpa: roundToTwo(gpa),
    courses: results,
  };
};

export const calculateCgpa = (
  results: GpaCourseResult[],
): GpaCalculation => {
  return calculateGpa(results);
};
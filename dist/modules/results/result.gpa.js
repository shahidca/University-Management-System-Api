import { AppError } from "../../utils/app-error.js";
const roundToTwo = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};
export const calculateGpa = (results) => {
    if (results.length === 0) {
        throw new AppError("No published results available for GPA calculation", 404);
    }
    const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);
    if (totalCredits <= 0) {
        throw new AppError("GPA cannot be calculated because total credits are zero", 400);
    }
    const totalQualityPoints = results.reduce((sum, result) => sum + result.gradePoint * result.credits, 0);
    const gpa = totalQualityPoints / totalCredits;
    return {
        totalCredits: roundToTwo(totalCredits),
        totalQualityPoints: roundToTwo(totalQualityPoints),
        gpa: roundToTwo(gpa),
        courses: results,
    };
};
export const calculateCgpa = (results) => {
    return calculateGpa(results);
};
//# sourceMappingURL=result.gpa.js.map
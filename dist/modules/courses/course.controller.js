import { sendSuccess } from "../../utils/api-response.js";
import { activateCourse, createCourse, deactivateCourse, deleteCourse, getCourseById, getCourses, updateCourse, } from "./course.service.js";
export const createCourseController = async (req, res) => {
    const course = await createCourse(req.body);
    sendSuccess(res, 201, "Course created successfully", course);
};
export const getCoursesController = async (req, res) => {
    const result = await getCourses(req.query);
    sendSuccess(res, 200, "Courses retrieved successfully", result);
};
export const getCourseByIdController = async (req, res) => {
    const course = await getCourseById(req.params.id);
    sendSuccess(res, 200, "Course retrieved successfully", course);
};
export const updateCourseController = async (req, res) => {
    const course = await updateCourse(req.params.id, req.body);
    sendSuccess(res, 200, "Course updated successfully", course);
};
export const activateCourseController = async (req, res) => {
    const course = await activateCourse(req.params.id);
    sendSuccess(res, 200, "Course activated successfully", course);
};
export const deactivateCourseController = async (req, res) => {
    const course = await deactivateCourse(req.params.id);
    sendSuccess(res, 200, "Course deactivated successfully", course);
};
export const deleteCourseController = async (req, res) => {
    await deleteCourse(req.params.id);
    sendSuccess(res, 200, "Course deleted successfully", null);
};
//# sourceMappingURL=course.controller.js.map
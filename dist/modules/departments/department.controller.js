import { sendSuccess } from "../../utils/api-response.js";
import { createDepartment, deleteDepartment, getDepartmentById, getDepartments, updateDepartment, } from "./department.service.js";
export const createDepartmentController = async (req, res) => {
    const department = await createDepartment(req.body);
    sendSuccess(res, 201, "Department created successfully", department);
};
export const getDepartmentsController = async (req, res) => {
    const result = await getDepartments(req.query);
    sendSuccess(res, 200, "Departments retrieved successfully", result);
};
export const getDepartmentByIdController = async (req, res) => {
    const department = await getDepartmentById(req.params.id);
    sendSuccess(res, 200, "Department retrieved successfully", department);
};
export const updateDepartmentController = async (req, res) => {
    const department = await updateDepartment(req.params.id, req.body);
    sendSuccess(res, 200, "Department updated successfully", department);
};
export const deleteDepartmentController = async (req, res) => {
    await deleteDepartment(req.params.id);
    sendSuccess(res, 200, "Department deleted successfully", null);
};
//# sourceMappingURL=department.controller.js.map
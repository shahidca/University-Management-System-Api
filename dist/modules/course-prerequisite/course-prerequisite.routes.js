import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCoursePrerequisiteController, deleteCoursePrerequisiteController, getCoursePrerequisiteByIdController, getCoursePrerequisitesController, updateCoursePrerequisiteController, } from "./course-prerequisite.controller.js";
import { createCoursePrerequisiteSchema, prerequisiteListQuerySchema, updateCoursePrerequisiteSchema, } from "./course-prerequisite.validation.js";
const router = Router();
router.get("/", validate(prerequisiteListQuerySchema), asyncHandler(getCoursePrerequisitesController));
router.get("/:id", asyncHandler(getCoursePrerequisiteByIdController));
router.post("/", authenticate, requireRole("ADMIN"), validate(createCoursePrerequisiteSchema), asyncHandler(createCoursePrerequisiteController));
router.patch("/:id", authenticate, requireRole("ADMIN"), validate(updateCoursePrerequisiteSchema), asyncHandler(updateCoursePrerequisiteController));
router.delete("/:id", authenticate, requireRole("ADMIN"), asyncHandler(deleteCoursePrerequisiteController));
export default router;
//# sourceMappingURL=course-prerequisite.routes.js.map
import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createProgramController, deleteProgramController, getProgramByIdController, getProgramsController, updateProgramController, } from "./program.controller.js";
import { createProgramSchema, programListQuerySchema, updateProgramSchema, } from "./program.validation.js";
const router = Router();
/*
 * Read operations
 */
router.get("/", validate(programListQuerySchema), asyncHandler(getProgramsController));
router.get("/:id", asyncHandler(getProgramByIdController));
/*
 * ADMIN-only management
 */
router.post("/", authenticate, requireRole("ADMIN"), validate(createProgramSchema), asyncHandler(createProgramController));
router.patch("/:id", authenticate, requireRole("ADMIN"), validate(updateProgramSchema), asyncHandler(updateProgramController));
router.delete("/:id", authenticate, requireRole("ADMIN"), asyncHandler(deleteProgramController));
export default router;
//# sourceMappingURL=program.routes.js.map
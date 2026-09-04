import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { activateSectionController, createSectionController, deactivateSectionController, deleteSectionController, getSectionByIdController, getSectionsController, updateSectionController, } from "./section.controller.js";
import { createSectionSchema, sectionListQuerySchema, updateSectionSchema, } from "./section.validation.js";
const router = Router();
router.get("/", validate(sectionListQuerySchema), asyncHandler(getSectionsController));
router.get("/:id", asyncHandler(getSectionByIdController));
router.post("/", authenticate, requireRole("ADMIN"), validate(createSectionSchema), asyncHandler(createSectionController));
router.patch("/:id", authenticate, requireRole("ADMIN"), validate(updateSectionSchema), asyncHandler(updateSectionController));
router.patch("/:id/activate", authenticate, requireRole("ADMIN"), asyncHandler(activateSectionController));
router.patch("/:id/deactivate", authenticate, requireRole("ADMIN"), asyncHandler(deactivateSectionController));
router.delete("/:id", authenticate, requireRole("ADMIN"), asyncHandler(deleteSectionController));
export default router;
//# sourceMappingURL=section.routes.js.map
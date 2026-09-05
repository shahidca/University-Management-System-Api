import { Router } from "express";

import { asyncHandler } from "../../utils/async-handler.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

import {
  createAttendanceController,
  deleteAttendanceController,
  getAttendanceByIdController,
  getAttendanceSummaryController,
  getAttendancesController,
  getMyAttendanceController,
  updateAttendanceController,
} from "./attendance.controller.js";

import {
  attendanceListQuerySchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validation.js";


const router = Router();

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
|
| Must be declared BEFORE /:id routes.
|
*/

router.get(
  "/my",
  authenticate,
  requireRole("STUDENT"),
  validateRequest({
    query: attendanceListQuerySchema,
  }),
  asyncHandler(
    getMyAttendanceController,
  ),
);

/*
|--------------------------------------------------------------------------
| Attendance summary
|--------------------------------------------------------------------------
*/

router.get(
  "/summary/:enrollmentId",
  authenticate,
  asyncHandler(
    getAttendanceSummaryController,
  ),
);

/*
|--------------------------------------------------------------------------
| List attendance
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requireRole(
    "ADMIN",
    "INSTRUCTOR",
  ),
  validateRequest({
    query: attendanceListQuerySchema,
  }),
  asyncHandler(
    getAttendancesController,
  ),
);

/*
|--------------------------------------------------------------------------
| Get attendance by ID
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  asyncHandler(
    getAttendanceByIdController,
  ),
);

/*
|--------------------------------------------------------------------------
| Create attendance
|--------------------------------------------------------------------------
|
| Only instructors can mark attendance.
|
*/

router.post(
  "/",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: createAttendanceSchema,
  }),
  asyncHandler(
    createAttendanceController,
  ),
);

/*
|--------------------------------------------------------------------------
| Update attendance
|--------------------------------------------------------------------------
|
| Only the instructor assigned to the section
| can update the attendance.
|
*/

router.patch(
  "/:id",
  authenticate,
  requireRole("INSTRUCTOR"),
  validateRequest({
    body: updateAttendanceSchema,
  }),
  asyncHandler(
    updateAttendanceController,
  ),
);

/*
|--------------------------------------------------------------------------
| Delete attendance
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requireRole("INSTRUCTOR"),
  asyncHandler(
    deleteAttendanceController,
  ),
);

export default router;
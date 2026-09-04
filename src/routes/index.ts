import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import studentRouter from "../modules/student/student.routes.js";
import departmentRouter from "../modules/departments/department.routes.js";
import programRouter from "../modules/programs/program.routes.js";
import academicYearRoutes from "../modules/academic-years/academic-year.routes.js";
import semesterRoutes from "../modules/semesters/semester.routes.js";
import courseRoutes from "../modules/courses/course.routes.js";
import coursePrerequisiteRoutes from "../modules/course-prerequisite/course-prerequisite.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "UniCore API v1 is running",
    data: {
      version: "v1",
      service: "university-management-system-api",
    },
  });
});

router.use("/auth", authRouter);
router.use("/students", studentRouter);
router.use(
  "/departments",
  departmentRouter,
);
router.use(
  "/programs",
  programRouter,
);

router.use(
  "/academic-years",
  academicYearRoutes,
);

router.use(
  "/semesters",
  semesterRoutes,
);

router.use(
  "/courses",
  courseRoutes,
);

router.use(
  "/course-prerequisites",
  coursePrerequisiteRoutes,
);

export default router;
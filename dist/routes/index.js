import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
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
export default router;
//# sourceMappingURL=index.js.map
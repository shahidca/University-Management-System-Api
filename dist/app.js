import express from "express";
import helmet from "helmet";
import cors from "cors";
import { prisma } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
const app = express();
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "UniCore API is healthy",
        data: {
            service: "university-management-system-api",
            status: "OK",
            timestamp: new Date().toISOString(),
        },
    });
});
app.get("/health/db", async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.status(200).json({
            success: true,
            message: "Database connection is healthy",
            data: {
                database: "PostgreSQL",
                status: "CONNECTED",
            },
        });
    }
    catch {
        res.status(503).json({
            success: false,
            message: "Database connection failed",
            errors: [],
        });
    }
});
/*
 * Centralized error handler
 * Must remain after all routes and middleware.
 */
app.use("/api/v1", apiRouter);
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map
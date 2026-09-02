import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        app.listen(env.PORT, () => {
            console.log(`UniCore API running on http://localhost:${env.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};
startServer();
const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down...`);
    await prisma.$disconnect();
    process.exit(0);
};
process.on("SIGINT", () => {
    void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});
//# sourceMappingURL=server.js.map
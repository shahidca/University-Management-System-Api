import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { verifyMailTransporter } from "./config/mail.js";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    await verifyMailTransporter();

    app.listen(env.PORT, () => {
      console.log(
        `UniCore API running on http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start UniCore API:",
      error,
    );

    process.exit(1);
  }
};

void startServer();

const shutdown = async (
  signal: string,
): Promise<void> => {
  console.log(
    `\n${signal} received. Shutting down...`,
  );

  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
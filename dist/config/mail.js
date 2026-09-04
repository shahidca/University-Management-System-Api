import nodemailer from "nodemailer";
import { env } from "./env.js";
export const mailTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
    },
});
export const verifyMailTransporter = async () => {
    try {
        await mailTransporter.verify();
        console.log("Email transporter connected successfully");
    }
    catch (error) {
        console.error("Email transporter connection failed:", error);
    }
};
//# sourceMappingURL=mail.js.map
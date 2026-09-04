import { env } from "../config/env.js";
import { mailTransporter } from "../config/mail.js";
export const sendVerificationEmail = async (email, firstName, otp) => {
    const result = await mailTransporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "UniCore Email Verification Code",
        text: `Hello ${firstName},

Your UniCore email verification code is:

${otp}

This code will expire in 10 minutes.

If you did not create a UniCore account, you can safely ignore this email.

Regards,
UniCore Team`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>UniCore Email Verification</h2>

          <p>Hello ${firstName},</p>

          <p>
            Your email verification code is:
          </p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>
            This code will expire in
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not create a UniCore account,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>UniCore Team</strong>
          </p>
        </div>
      `,
    });
    console.log(`Verification email accepted by SMTP for: ${email}`);
    console.log(`Email message ID: ${result.messageId}`);
    console.log(`SMTP response: ${result.response}`);
};
export const sendPasswordResetEmail = async (email, firstName, otp) => {
    const result = await mailTransporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "UniCore Password Reset Code",
        text: `Hello ${firstName},

Your UniCore password reset code is:

${otp}

This code will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
UniCore Team`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>UniCore Password Reset</h2>

          <p>Hello ${firstName},</p>

          <p>
            Your password reset code is:
          </p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>
            This code will expire in
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>UniCore Team</strong>
          </p>
        </div>
      `,
    });
    console.log(`Password reset email accepted by SMTP for: ${email}`);
    console.log(`Email message ID: ${result.messageId}`);
};
//# sourceMappingURL=email.js.map
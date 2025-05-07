import { CustomError } from "../utils/custom-error";
import "dotenv/config";
import SendEmail from "../lib/nodemailer";
export const verifyAccountService = async (token: string, email: string) => {
  const resetLink = `https://techtales-8k21.onrender.com/page/verify-account/${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirm your email",
    text: `Hi,\n\nWe received a request to reset your password. Please use the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
    html: `
        <p>Click the link below to confirm your email. This link is valid for 1 day.</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
  };

  const emailSent = await SendEmail(mailOptions);
  if (!emailSent) {
    throw new CustomError("Email not sent", 404);
  }

  return {
    message: "Verification email sent successfully",
  };
};

import { CustomError } from "../utils/custom-error";
import "dotenv/config";
import SendEmail from "../lib/nodemailer";
export const forgotPasswordService = async (token: string, email: string) => {
  const resetLink = `http://localhost:5173/page/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `Hi,\n\nWe received a request to reset your password. Please use the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
    html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password. This link is valid for 1 day.</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
  };

  const emailSent = await SendEmail(mailOptions);
  if (!emailSent) {
    throw new CustomError("Email not sent", 404);
  }

  return {
    message: "Email sent successfully",
  };
};

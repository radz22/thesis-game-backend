import { Request, Response, NextFunction } from "express";
import { hashText, compareTextToHashedText } from "../lib/bcrypt";
import { CustomError } from "../utils/custom-error";
import { createAuthenticationAccount } from "../services/create-authentication";
import { checkEmailExisting } from "../services/check-email-existing-";
import { createSessionAndDeleteToken } from "../services/create-authentication";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user-model";
import {
  generateResetToken,
  generateVerifyAccountCreateToken,
} from "../services/generate-token";
import RequestWithSession from "../types/request-with-session";
import { forgotPasswordService } from "../services/reset-password-service";
import {
  verifyResetPasswordToken,
  verifyAccountCreateToken,
} from "../services/verify-token";
import { updatePassword } from "../services/update-password";
import { verifyAccountService } from "../services/create-account-token-service";
import {
  generateAcessToken,
  generateRefreshToken,
} from "../services/generate-token";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existUsername = await userModel.findOne({ username });

    if (existUsername) {
      throw new CustomError("Username already exists", 400);
    }

    const existEmail = await userModel.findOne({ email });

    if (existEmail) {
      throw new CustomError("Email already exists", 400);
    }
    const verifyAccountTOken = generateVerifyAccountCreateToken(
      email,
      password,
      username
    );
    const { message } = await verifyAccountService(verifyAccountTOken, email);

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    next(error);
  }
};
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const account = await checkEmailExisting(email);

    if (!account) {
      throw new CustomError("Account not Found", 400);
    }

    const isPasswordValid = await compareTextToHashedText(
      password,
      account.password
    );

    if (!isPasswordValid) {
      throw new CustomError("Invalid Password", 400);
    }

    const accessToken = generateAcessToken(
      account.id,
      account.email,
      account.username
    );

    const refreshToken = generateRefreshToken(
      account.id,
      account.email,
      account.username
    );

    const { success_response } = await createSessionAndDeleteToken(
      account.id,
      refreshToken
    );

    if (!success_response) {
      throw new CustomError("Failed to create session", 500);
    }

    res.cookie("auth_accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("auth_refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new CustomError("No token provided", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    res.status(200).json({
      decoded,
    });
  } catch (error) {
    next(error);
  }
};
export const profile = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = req.session;

  try {
    res.json({
      message: "Profile fetched successfully",
      user: session?.account_id,
      email: session?.email,
      username: session?.username,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const existingEmail = await checkEmailExisting(email);
    if (!existingEmail) {
      throw new CustomError("Email not Found", 400);
    }

    const resetToken = generateResetToken(
      existingEmail.id,
      existingEmail.email
    );

    const { message } = await forgotPasswordService(
      resetToken,
      existingEmail.email
    );

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newpassword } = req.body;

    if (!token) {
      throw new CustomError("No token provided", 401);
    }

    const { id, email } = await verifyResetPasswordToken(token);

    const findEmail = await checkEmailExisting(email);

    if (!findEmail) {
      throw new CustomError("Account not Found", 400);
    }
    const hashedNewPassword = await hashText(newpassword);
    if (!hashedNewPassword) {
      throw new CustomError("Failed to hash password", 500);
    }

    const newPassword = await updatePassword(id, hashedNewPassword);

    res.status(200).json({
      message: "Password updated successfully",
      user: newPassword,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("auth_accessToken");
  res.clearCookie("auth_refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const verifyCreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new CustomError("No token provided", 401);
    }

    const { username, email, password } = await verifyAccountCreateToken(token);
    const hashedPassword = await hashText(password);

    if (!hashedPassword) {
      throw new CustomError("Failed to hash password", 500);
    }
    const { user, Success_response } = await createAuthenticationAccount({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      message: Success_response,
      user: user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateAcessToken = (
  id: string,
  email: string,
  username: string
) => {
  const accessToken = jwt.sign(
    {
      id: id,
      email: email,
      username: username,
      iss: "login",
      aud: "thesisgame.app",
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "1h" }
  );

  return accessToken;
};

export const generateRefreshToken = (
  id: string,
  email: string,
  username: string
) => {
  const refreshToken = jwt.sign(
    {
      id: id,
      email: email,
      username: username,
      iss: "login",
      aud: "thesisgame.app",
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "1d" }
  );

  return refreshToken;
};
export const generateResetToken = (id: string, email: string) => {
  const resetToken = jwt.sign(
    {
      id: id,
      email: email,
      iss: "reset-password",
      aud: "thesisgame.app",
    },
    process.env.JWT_RESET_SECRET as string,
    { expiresIn: "1d" }
  );

  return resetToken;
};
export const generateVerifyAccountCreateToken = (
  email: string,
  password: string,
  username: string
) => {
  const verifyEmailToken = jwt.sign(
    {
      password: password,
      email: email,
      username: username,
      iss: "verify-email-token",
      aud: "thesisgame.app",
    },
    process.env.JWT_ACCOUNT_VERIFY as string,
    { expiresIn: "1d" }
  );

  return verifyEmailToken;
};

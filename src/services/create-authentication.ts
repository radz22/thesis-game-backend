import { accountModel } from "../model/account-model";
import { userModel } from "../model/user-model";
import { createauthenticationtype } from "../types/create-authentication-type";
import { CustomError } from "../utils/custom-error";
import { sessionModel } from "../model/session-model";
export const createAuthenticationAccount = async ({
  username,
  password,
  email,
}: createauthenticationtype) => {
  const existingUser = await accountModel.findOne({ email });
  if (existingUser) {
    throw new CustomError("Account with this email already exists", 409);
  }

  const createUserAccount = await accountModel.create({
    username,
    email,
    password,
  });

  if (!createUserAccount) {
    throw new CustomError("Failed to create user account", 500);
  }

  await userModel.create({
    username,
    email,
    user_id: createUserAccount._id,
  });

  return {
    user: createUserAccount,
    Success_response: "Account created successfully",
  };
};

export const createSessionAndDeleteToken = async (
  id: string,
  refresh_token: string
) => {
  const deleteToken = await sessionModel.deleteMany({ account_id: id });

  if (!deleteToken) {
    throw new CustomError("Failed to delete token", 500);
  }

  const createSession = await sessionModel.create({
    account_id: id,
    refresh_token: refresh_token,
  });

  if (!createSession) {
    throw new CustomError("Failed to create session", 500);
  }
  return {
    success_response: true,
  };
};

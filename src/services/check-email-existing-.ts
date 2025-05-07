import { accountModel } from "../model/account-model";
export const checkEmailExisting = async (email: string) => {
  const existingUser = await accountModel.findOne({ email });
  return existingUser;
};

import { accountModel } from "../model/account-model";
import { CustomError } from "../utils/custom-error";

export const updatePassword = async (id: string, newpassword: string) => {
  const updatePassword = await accountModel.findOneAndUpdate(
    { _id: id },
    { password: newpassword },
    { new: true }
  );
  if (!updatePassword) {
    throw new CustomError("Failed to update password", 500);
  }
  return updatePassword;
};

import bcrypt from "bcrypt";

export const hashText = async (
  text: string,
  saltRounds = 12
): Promise<string | null> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedText = await bcrypt.hash(text, salt);
    return hashedText;
  } catch (error) {
    return null;
  }
};

export const compareTextToHashedText = async (
  plainText: string,
  hashedText: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainText, hashedText);
  } catch (error) {
    return false;
  }
};

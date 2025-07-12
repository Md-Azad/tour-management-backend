import { envVars } from "../config/env";
import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, envVars.SALT_ROUND);
  return hashedPassword;
};

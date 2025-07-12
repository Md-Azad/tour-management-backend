import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const JwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const accssToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_TOKEN,
    envVars.JWT_EXPIRES
  );

  const refreshToken = generateToken(
    JwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accssToken,
    refreshToken,
  };
};

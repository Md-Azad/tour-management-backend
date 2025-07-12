import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Email or Password is incorrect."
    );
  }

  const isMatchedPassword = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isMatchedPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Email or Password is incorrect."
    );
  }

  const JwtPayload = {
    userId: isUserExist._id,
    role: isUserExist.role,
    email,
  };

  const accssToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_TOKEN,
    envVars.JWT_EXPIRES
  );

  return {
    token: accssToken,
  };
};

export const authService = {
  credentialLogin,
};

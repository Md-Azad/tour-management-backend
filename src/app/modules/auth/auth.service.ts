import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { createUserToken } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

  const token = createUserToken(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accssToken: token.accssToken,
    refreshToken: token.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const refToken = (await verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  )) as JwtPayload;

  const isExist = await User.findOne({ email: refToken.email });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User did not find.");
  }

  if (
    isExist.isActive === IsActive.INACTIVE ||
    isExist.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `The user is ${isExist.isActive}`
    );
  }
  if (isExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, `The user is deleted.`);
  }

  const payload = {
    userId: isExist._id,
    role: isExist.role,
    email: isExist.email,
  };

  const newAccessToken = generateToken(
    payload,
    envVars.JWT_ACCESS_TOKEN,
    envVars.JWT_EXPIRES
  );

  return {
    newAccessToken,
  };
};

export const authService = {
  credentialLogin,
  getNewAccessToken,
};

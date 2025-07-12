import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";

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

export const createAccessTokenFromRefreshToken = async (
  refreshToken: string
) => {
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

  return newAccessToken;
};

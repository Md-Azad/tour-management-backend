/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import {
  createAccessTokenFromRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { hashPassword } from "../../utils/hashPassword";

import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";

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
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createAccessTokenFromRefreshToken(refreshToken);

  return {
    accessToken,
  };
};
const resetPassword = async (
  newPassword: string,
  oldPassword: string,
  decodedUser: JwtPayload
) => {
  const user = await User.findById(decodedUser.userId);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not found.");
  }
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password does not match");
  }
  const hashedNewPassword = await hashPassword(newPassword);

  user.password = hashedNewPassword;

  user?.save();
};
const changePassword = async (
  userId: string,
  newPassword: string,
  decodedUser: JwtPayload
) => {
  console.log(userId, decodedUser.id);
  if (userId !== decodedUser.id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "you can not change password");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not found.");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  user.password = hashedNewPassword;

  await user?.save();
};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not found.");
  }

  if (user.password && user.auths.some((pro) => pro.provider === "gmail")) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You already set password. You can reset Password now"
    );
  }
  const credantialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const hashedNewPassword = await hashPassword(plainPassword);
  const auths = [...user.auths, credantialProvider];

  user.password = hashedNewPassword;
  user.auths = auths;

  user.save();
};
const forgetPassword = async (email: string) => {
  const isExistUser = await User.findOne({ email });

  if (!isExistUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not found.");
  }

  if (
    isExistUser.isActive === IsActive.INACTIVE ||
    isExistUser.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `The user is ${isExistUser.isActive}`
    );
  }
  if (isExistUser.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, `The user is deleted.`);
  }

  const jwtPayload = {
    id: isExistUser._id,
    email: isExistUser.email,
    role: isExistUser.role,
  };

  const token = jwt.sign(jwtPayload, envVars.JWT_ACCESS_TOKEN, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isExistUser._id}&token=${token}`;

  sendEmail({
    to: isExistUser.email,
    subject: "Forget Password",
    templateName: "forgetPassword.ejs",
    templateData: {
      name: isExistUser.name,
      resetUILink,
    },
  });

  return token;
};

export const authService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  forgetPassword,
  changePassword,
};

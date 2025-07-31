/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import {
  createAccessTokenFromRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { hashPassword } from "../../utils/hashPassword";

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

export const authService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
};

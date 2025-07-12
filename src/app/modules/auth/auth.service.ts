import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { createUserToken } from "../../utils/userTokens";

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

export const authService = {
  credentialLogin,
};

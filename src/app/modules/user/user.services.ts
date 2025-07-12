import { StatusCodes } from "http-status-codes";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exist");
  }
  const hashedPassword = await bcrypt.hash(
    password as string,
    envVars.SALT_ROUND
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUser = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    users,
    meta: {
      total: totalUsers,
    },
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id);
  return user;
};
const deleleUser = async (id: string) => {
  const result = await User.findOneAndDelete(id);
  return result;
};

export const userServices = {
  createUser,
  getAllUser,
  getSingleUser,
  deleleUser,
};

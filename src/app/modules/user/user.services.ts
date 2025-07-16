import httpStatus from "http-status-codes";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { hashPassword } from "../../utils/hashPassword";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  // }
  const hashedPassword = await hashPassword(password as string);
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
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  verifiedToken: JwtPayload
) => {
  const isExist = await User.findById({ _id: userId });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (payload.role) {
    if (verifiedToken.role === Role.USER || verifiedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (
      payload.role === Role.SUPER_ADMIN &&
      verifiedToken.role === Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (verifiedToken.role === Role.USER || verifiedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password);
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
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
  const result = await User.findOneAndDelete({ id });
  return result;
};

export const userServices = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  deleleUser,
};

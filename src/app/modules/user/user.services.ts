import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { number } from "zod";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({ name, email });

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

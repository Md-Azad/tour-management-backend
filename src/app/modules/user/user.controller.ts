import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(StatusCodes.CREATED).send({
      message: "user created Successfully.",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
};

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUser();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "All users retrieved successfully",
      data: users,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
};

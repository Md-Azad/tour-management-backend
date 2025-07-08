import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/apiResponce";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: " User Created successfully",
      data: user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
};

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUser();

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All users retrieved successfully",
      data: result.users,
      meta: result.meta,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
};

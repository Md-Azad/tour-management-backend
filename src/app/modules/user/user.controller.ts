import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/apiResponce";

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createUser(req.body);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: " users Created successfully",
      data: result,
    });
  }
);
const updateUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const token = req.user;
    const result = await userServices.updateUser(userId, req.body, token);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: " users Updated successfully",
      data: result,
    });
  }
);

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
const getSingleUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: " user retrieved successfully",
      data: result,
    });
  }
);
const deleteUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userServices.deleleUser(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: " user deleted successfully",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  deleteUser,
};

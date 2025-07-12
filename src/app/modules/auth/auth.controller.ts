import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = await authService.credentialLogin(req.body);
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logged In successfully",
      data: loggedInUser,
    });
  }
);
const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization;
    const accessToken = await authService.getNewAccessToken(
      refreshToken as string
    );
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logged In successfully",
      data: accessToken,
    });
  }
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
};

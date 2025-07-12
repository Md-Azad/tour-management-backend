import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";
import { setAuthTokenToCookie } from "../../utils/setAuthToken";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = await authService.credentialLogin(req.body);

    setAuthTokenToCookie(res, loggedInUser);

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
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await authService.getNewAccessToken(
      refreshToken as string
    );
    setAuthTokenToCookie(res, accessToken);
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New access token retrieved successfully",
      data: accessToken,
    });
  }
);
const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logout successfully",
      data: null,
    });
  }
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
  logout,
};

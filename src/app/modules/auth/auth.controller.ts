/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";
import { setAuthTokenToCookie } from "../../utils/setAuthToken";
import AppError from "../../errorHelpers/AppError";
import { createUserToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUserToken(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...rest } = user.toObject();

      setAuthTokenToCookie(res, userTokens);

      sendResponce(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
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
const resetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedUser = req.user as JwtPayload;
    await authService.resetPassword(newPassword, oldPassword, decodedUser);
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password has been updated.",
      data: null,
    });
  }
);
const forgetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await authService.forgetPassword(email);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Email sent successfully.",
      data: null,
    });
  }
);
const setPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.user as JwtPayload;

    const { password } = req.body;

    await authService.setPassword(decodedUser?.userId, password);
    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password has been added successfully.",
      data: null,
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
const googleCallBack = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User did not found.");
    }

    const tokens = createUserToken(user);
    console.log(tokens);

    setAuthTokenToCookie(res, tokens);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallBack,
  setPassword,
  forgetPassword,
};

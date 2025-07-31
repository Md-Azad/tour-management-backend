import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRules: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessTokena = req.headers.authorization;

      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "Token did not receive.");
      }

      const isVerified = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_TOKEN
      ) as JwtPayload;

      const isExist = await User.findOne({ email: isVerified.email });

      if (!isExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User did not find.");
      }

      if (
        isExist.isActive === IsActive.INACTIVE ||
        isExist.isActive === IsActive.BLOCKED
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `The user is ${isExist.isActive}`
        );
      }
      if (isExist.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, `The user is deleted.`);
      }

      if (!authRules.includes(isVerified.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not allowed to check the route."
        );
      }
      req.user = isVerified;
      next();
    } catch (error) {
      next(error);
    }
  };

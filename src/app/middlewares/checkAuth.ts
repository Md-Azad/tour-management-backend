import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRules: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "Token did not receive.");
      }
      const isVerified = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_TOKEN
      ) as JwtPayload;
      if (!authRules.includes(isVerified.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are not allowed to check the route."
        );
      }
      // req.user = isVerified
      next();
    } catch (error) {
      next(error);
    }
  };

import { Request, Response } from "express";
import { sendResponce } from "../../utils/apiResponce";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { statsService } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const userstats = await statsService.getUserStats();
  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User stats retrieved Successfully.",
    data: userstats,
  });
});

export const statsController = {
  getUserStats,
};

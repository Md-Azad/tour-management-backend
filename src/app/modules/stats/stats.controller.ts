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
const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const tourStats = await statsService.getTourStats();
  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Tour stats retrieved Successfully.",
    data: tourStats,
  });
});
const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const bookingStats = await statsService.getBookingStats();
  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Booking stats retrieved Successfully.",
    data: bookingStats,
  });
});
const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const paymentStats = await statsService.getPaymentStats();
  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Payment stats retrieved Successfully.",
    data: paymentStats,
  });
});

export const statsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};

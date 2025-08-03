import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";
import { otpService } from "./otp.service";

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;

  await otpService.sendOtp(email, name);
  sendResponce(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP sent Successfully.",
    data: null,
  });
});
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await otpService.verifyOtp(email, otp);
  sendResponce(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP verified Successfully.",
    data: null,
  });
});

export const otpController = {
  sendOtp,
  verifyOtp,
};

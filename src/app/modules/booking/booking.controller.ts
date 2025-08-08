import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;

  const booking = await bookingServices.createBooking(
    req.body,
    decodedToken.userId as string
  );

  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `Your booking has been created`,
    data: booking,
  });
});

export const bookingController = {
  createBooking,
};

import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const user = await User.findById(userId);
  if (user) {
    if (!user.phone || !user.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Update your phone number or Address in your account."
      );
    }
  }
  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(StatusCodes.BAD_REQUEST, "no tour cost found.");
  }

  const tourCost = Number(tour?.costFrom);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const amount = Number(payload.guestCount) * tourCost;

  const payment = await Payment.create({
    transactionId,
    status: BOOKING_STATUS.UNPAID,
    booking: booking._id,
    amount,
  });

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { payment: payment._id },
    { new: true, runValidators: true }
  )
    .populate("user")
    .populate("tour")
    .populate("payment");

  return updatedBooking;
};

export const bookingServices = {
  createBooking,
};

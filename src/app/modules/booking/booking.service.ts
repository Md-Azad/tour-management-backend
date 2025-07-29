/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
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
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(StatusCodes.BAD_REQUEST, "no tour cost found.");
    }

    const tourCost = Number(tour?.costFrom);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(payload.guestCount) * tourCost;

    const payment = await Payment.create([
      {
        transactionId,
        status: BOOKING_STATUS.UNPAID,
        booking: booking[0]._id,

        amount,
      },
    ]);

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userPhone = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;
    const userEmail = (updatedBooking?.user as any).email;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      phoneNumber: userPhone,
      name: userName,
      email: userEmail,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await sslCommerzService.sslCommerzinit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const bookingServices = {
  createBooking,
};

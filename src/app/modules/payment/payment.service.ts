/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You did not book this tour yet."
    );
  }

  if (payment.status === PAYMENT_STATUS.PAID) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You payment is done already.");
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userPhone = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;
  const userEmail = (booking?.user as any).email;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    phoneNumber: userPhone,
    name: userName,
    email: userEmail,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await sslCommerzService.sslCommerzinit(sslPayload);

  return {
    sslPayment: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  // update booking status to 'CONFIRM'
  // Update booking status to "PAID"
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CONFIRM },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment successfully done.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  // update booking status to 'FAIL'
  // Update booking status to "FAIL"

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment Failed.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  // update booking status to 'CANCEL'
  // Update booking status to "CANCEL"
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment canceled.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const paymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};

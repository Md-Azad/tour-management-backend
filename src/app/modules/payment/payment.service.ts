import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  // update booking status to 'CONFIRM'
  // Update booking status to "PAID"
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CONFIRM },
      { new: true, runValidators: true, session }
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
const failPayment = () => {
  // update booking status to 'FAIL'
  // Update booking status to "FAIL"
};
const cancelPayment = () => {
  // update booking status to 'CANCEL'
  // Update booking status to "CANCEL"
};

export const paymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};

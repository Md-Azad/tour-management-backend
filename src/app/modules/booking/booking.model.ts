import { model, Schema, Types } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { object } from "zod";

export const bookingSchema = new Schema<IBooking>({
  //  user: Types.ObjectId;
  //   tour: Types.ObjectId;
  //   payment?: Types.ObjectId;
  //   guestCount: number;
  //   status: BOOKING_STATUS;
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
  guestCount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.PENDING,
  },
});

export const Booking = model<IBooking>("Booking", bookingSchema);

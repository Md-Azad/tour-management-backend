import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCELED",
  CONFIRM = "CONFIRM",
  FAILED = "FAILED",
  UNPAID = "UNPAID",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: BOOKING_STATUS;
  createdAt?: Date;
}

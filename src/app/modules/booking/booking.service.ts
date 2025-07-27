import { IBooking } from "./booking.interface";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  console.log(payload);
  console.log(userId);

  return {
    payload,
    userId,
  };
};

export const bookingServices = {
  createBooking,
};

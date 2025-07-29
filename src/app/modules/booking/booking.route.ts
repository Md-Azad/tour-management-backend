import express from "express";
import { bookingController } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validation } from "../../middlewares/responceValidation";
import { createBookingZodSchema } from "./booking.validation";
const router = express.Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validation(createBookingZodSchema),
  bookingController.createBooking
);

export const bookingRouter = router;

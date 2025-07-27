import express from "express";
import { bookingController } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
const router = express.Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  bookingController.createBooking
);

export const bookingRouter = router;

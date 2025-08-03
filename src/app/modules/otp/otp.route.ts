import express from "express";
import { otpController } from "./otp.controller";

const router = express.Router();

router.post("/send-otp", otpController.sendOtp);

export const otpRouter = router;

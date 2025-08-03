import express from "express";
import { otpController } from "./otp.controller";

const router = express.Router();

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);

export const otpRouter = router;

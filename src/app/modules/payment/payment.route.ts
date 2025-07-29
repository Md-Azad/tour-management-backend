import express from "express";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post("/success", paymentController.successPayment);
// router.post("/fail");
// router.post("/cancel");

export const paymentRouter = router;

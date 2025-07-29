import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../config/env";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await paymentService.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status:success)`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {});

export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
};

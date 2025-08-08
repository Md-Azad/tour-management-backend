import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  const result = await paymentService.initPayment(bookingId as string);

  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `Payment done successfully`,
    data: result,
  });
});
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

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await paymentService.failPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status:failed)`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await paymentService.cancelPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status:cancel)`
    );
  }
});
const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response) => {
    const paymemntId = req.params.paymentId;
    const decodedToken = req.user as JwtPayload;

    const result = await paymentService.getInvoiceDownloadUrl(
      paymemntId,
      decodedToken
    );

    sendResponce(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Invoice url retrieved Successfully.",
      data: result,
    });
  }
);
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await sslCommerzService.validatePayment(req.body);

  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Payment verified Successfully.",
    data: null,
  });
});

export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
  validatePayment,
};

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const division = await divisionServices.createDivision(payload);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Division created successfully.",
      data: division,
    });
  }
);

export const divisionController = {
  createDivision,
};

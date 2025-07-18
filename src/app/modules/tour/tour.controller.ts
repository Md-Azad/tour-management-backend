/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourTypeService } from "./tour.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const type = req.body;

    const tourType = await tourTypeService.createTourType(type);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Tour type has been created",
      data: tourType,
    });
  }
);

export const tourController = {
  createTourType,
};

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
const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourTypeService.getAllTourType();

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Retrieved all tour types.",
      data: tourTypes,
    });
  }
);
const getSingleTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tourType = await tourTypeService.getSingleTourType(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Retrieved single tour type.",
      data: tourType,
    });
  }
);

export const tourController = {
  createTourType,
  getAllTourType,
  getSingleTourType,
};

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
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const tourType = await tourTypeService.updateTourType(id, payload);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "tour type updated successfully.",
      data: tourType,
    });
  }
);
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tourType = await tourTypeService.deleteTourType(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `${tourType} type is deleted successfully.`,
      data: null,
    });
  }
);

// ------------------ Tour related controllers ----------------

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const tour = await tourTypeService.createTour(payload);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Tour has been created",
      data: tour,
    });
  }
);

const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await tourTypeService.getAllTour();

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "tour updated successfully.",
      data: tours,
    });
  }
);
const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await tourTypeService.getSingleTour(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Retrieved single tour",
      data: tour,
    });
  }
);
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const tourType = await tourTypeService.updateTour(id, payload);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "tour updated successfully.",
      data: tourType,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tour = await tourTypeService.deleteTour(id);

    sendResponce(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `${tour}  is deleted successfully.`,
      data: null,
    });
  }
);

export const tourController = {
  createTourType,
  getAllTourType,
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  updateTour,
  getAllTour,
  getSingleTour,
  deleteTour,
};

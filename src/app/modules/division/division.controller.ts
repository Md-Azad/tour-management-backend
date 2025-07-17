import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionServices } from "./division.service";
import { sendResponce } from "../../utils/apiResponce";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createDivision = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await divisionServices.getAllDivision();

  sendResponce(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Retrieved All division",
    data: result,
  });
});
const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await divisionServices.getSingleDivision(slug);

  sendResponce(res, {
    statusCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const payload = req.body;

  const updatedDivision = await divisionServices.updateDivision(id, payload);

  sendResponce(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Divisions Updated Successfully.",
    data: updatedDivision,
  });
});

export const divisionController = {
  createDivision,
  getSingleDivision,
  getAllDivision,
  updateDivision,
};

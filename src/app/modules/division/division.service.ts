import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const isExistDivision = await Division.findOne({ name: payload.name });

  if (isExistDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name already taken.");
  }

  const division = await Division.create(payload);

  return division;
};

export const divisionServices = {
  createDivision,
};

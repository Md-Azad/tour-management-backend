import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
  const isExistDivision = await Division.findOne({ name: payload.name });

  if (isExistDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name already taken.");
  }

  const name = payload.name;
  const slug = name?.split(" ").join("-") as string;
  payload.slug = slug.toLowerCase();

  const division = await Division.create(payload);

  return division;
};

const getSingleDivision = async (slug: string) => {
  let inputSlug = slug?.split(" ").join("-") as string;
  inputSlug = inputSlug.toLowerCase();
  const division = await Division.findOne({ slug: inputSlug });

  if (!division) {
    throw new AppError(StatusCodes.NOT_FOUND, "Division is not found");
  }

  return {
    data: division,
  };
};

export const divisionServices = {
  createDivision,
  getSingleDivision,
};

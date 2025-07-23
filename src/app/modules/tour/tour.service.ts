import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });

  if (isTourTypeExist) {
    throw new AppError(409, "This tour type is already exists.");
  }

  const tourType = await TourType.create(payload);

  return tourType;
};
const getAllTourType = async () => {
  const tourTypes = await TourType.find({});

  return tourTypes;
};
const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findById(id);

  return tourType;
};
const updateTourType = async (id: string, payload: ITourType) => {
  const isTourTypeExist = await TourType.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour type did not find.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updatedTourType;
};
const deleteTourType = async (id: string) => {
  const isTourTypeExist = await TourType.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour type did not find.");
  }

  const deletedTourType = await TourType.findByIdAndDelete(id);
  if (!deletedTourType) {
    throw new AppError(StatusCodes.NOT_MODIFIED, "Tour type did not delete.");
  }

  return deletedTourType.name;
};

export const tourTypeService = {
  createTourType,
  getAllTourType,
  getSingleTourType,
  updateTourType,
  deleteTourType,
};

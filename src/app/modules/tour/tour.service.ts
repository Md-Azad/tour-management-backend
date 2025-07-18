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

export const tourTypeService = {
  createTourType,
  getAllTourType,
  getSingleTourType,
};

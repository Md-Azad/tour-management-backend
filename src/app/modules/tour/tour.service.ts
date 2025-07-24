import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

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
    runValidators: true,
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

// ----------------------------------------

// Tour related Apis

const createTour = async (payload: ITour) => {
  const isTourExist = await Tour.findOne({ title: payload.title });

  if (isTourExist) {
    throw new AppError(409, "This tour is already exists.");
  }

  const tour = await Tour.create(payload);

  return tour;
};

const getAllTour = async () => {
  const tourTypes = await Tour.find({});

  return tourTypes;
};

const getSingleTour = async (id: string) => {
  const tourType = await Tour.findById(id);

  return tourType;
};

const updateTour = async (id: string, payload: ITourType) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour did not find.");
  }

  const updatedTourType = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTourType;
};

const deleteTour = async (id: string) => {
  const isTourTypeExist = await Tour.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour  did not find.");
  }

  const deletedTour = await Tour.findByIdAndDelete(id);
  if (!deletedTour) {
    throw new AppError(StatusCodes.NOT_MODIFIED, "Tour did not delete.");
  }

  return deletedTour.title;
};

export const tourTypeService = {
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

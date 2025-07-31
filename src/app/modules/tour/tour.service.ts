import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { searchConstant } from "./tour.constant";

import { queryBuilder } from "../../utils/queryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

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

const getAllTour = async (query: Record<string, string>) => {
  const searchBuilder = new queryBuilder(Tour.find(), query);

  const tours = await searchBuilder
    .search(searchConstant)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    searchBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};
// const getAllTourOld = async (query: Record<string, string>) => {
//   const filter = query;

//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query?.fields?.split(",").join(" ") || "";

//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;

//   const skip = (page - 1) * limit;

//   for (const field of excludedFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQeury = {
//     $or: searchConstant.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   const tours = await Tour.find(searchQeury)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const total = await Tour.countDocuments();

//   const meta = {
//     page,
//     limit,
//     totalData: total,
//     totalPage: Math.ceil(total / limit),
//   };

//   return {
//     data: tours,
//     meta: meta,
//   };
// };

const getSingleTour = async (id: string) => {
  const tour = await Tour.findById(id);

  return tour;
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour did not find.");
  }
  let updatedImages = isTourExist.images || [];

  if (
    payload.deleteImage &&
    payload.deleteImage.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    updatedImages = isTourExist.images.filter(
      (img) => !payload.deleteImage?.includes(img)
    );
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    updatedImages = [...payload.images, ...updatedImages];
  }

  payload.images = updatedImages;

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (
    payload.deleteImage &&
    payload.deleteImage.length > 0 &&
    isTourExist.images &&
    isTourExist.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImage.map((url) => deleteImageFromCLoudinary(url))
    );
  }

  return updatedTour;
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

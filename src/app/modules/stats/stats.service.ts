import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const today = new Date();
const lastWeek = new Date(today).setDate(today.getDate() - 7);
const lastMonth = new Date(today).setDate(today.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: lastWeek },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  const usersByRolePromise = User.aggregate([
    //stage -1 : Grouping users by role and count total users in each role

    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};
const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    {
      // lookup tour type collection first.

      $lookup: {
        from: "tourtypes",
        foreignField: "_id",
        localField: "tourType",
        as: "type",
      },
    },

    // unwind the type, array to object

    {
      $unwind: "$type",
    },

    // grouping tour type

    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  //   avg tour cost
  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCost: { $avg: "$costFrom" },
      },
    },
  ]);

  //   total tour by division
  const totalTourByDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "byDivision",
      },
    },

    // unwind the division by name

    {
      $unwind: "$byDivision",
    },
    // group by name and count total tour under a division
    {
      $group: {
        _id: "$byDivision.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHighestBookedTourPromise = Booking.aggregate([
    // stage-1 : Group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    //stage-2 : sort the tour

    {
      $sort: { bookingCount: -1 },
    },

    //stage-3 : sort
    {
      $limit: 5,
    },

    //stage-4 lookup stage
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    //stage-5 unwind stage
    { $unwind: "$tour" },

    //stage-6 Project stage

    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalHighestBookedTourPromise,
  ]);
  return {
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    //stage-1 group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsPerTourPromise = Booking.aggregate([
    //stage1 group stage

    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    //stage-2 sort stage
    {
      $sort: { bookingCount: -1 },
    },

    //stage-3 limit stage
    {
      $limit: 10,
    },

    //stage-4 lookup stage
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },

    // stage5 - unwind stage
    {
      $unwind: "$tour",
    },

    // stage6 project stage

    {
      $project: {
        bookingCount: 1,
        _id: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // stage 1  - group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingsLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: lastWeek },
  });
  const bookingsLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  const totalBookingByUniqueUsersPromise = Booking.distinct("user").then(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingsPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingsLast7DaysPromise,
    bookingsLast30DaysPromise,
    totalBookingByStatusPromise,
    totalBookingByUniqueUsersPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  };
};
const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();
  const totalPaymentByPaidStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const totalRevenuePromise = Payment.aggregate([
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const averagePaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);
  const [
    totalPayment,
    totalPaymentByPaidStatus,
    totalRevenue,
    averagePaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByPaidStatusPromise,
    totalRevenuePromise,
    averagePaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);

  return {
    totalPayment,
    totalPaymentByPaidStatus,
    totalRevenue,
    averagePaymentAmount,
    paymentGatewayData,
  };
};

export const statsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};

import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsController } from "./stats.controller";

const router = express.Router();

router.get(
  "/user-stats",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getUserStats
);
router.get(
  "/tour-stats",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getTourStats
);
router.get(
  "/booking-stats",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getBookingStats
);
router.get(
  "/payment-stats",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  statsController.getPaymentStats
);

export const statsRoutes = router;

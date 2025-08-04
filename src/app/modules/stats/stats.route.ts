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

export const statsRoutes = router;

import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/tour-types",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.createTourType
);

export const tourRouter = router;

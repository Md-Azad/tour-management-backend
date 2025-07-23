import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validation } from "../../middlewares/responceValidation";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
} from "./tour.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validation(createTourTypeZodSchema),
  tourController.createTourType
);

router.get("/tour-types", tourController.getAllTourType);
router.get("/tour-types/:id", tourController.getSingleTourType);
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.updateTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType
);

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validation(createTourZodSchema),
  tourController.createTour
);
router.get("/", tourController.getAllTour);
router.get("/:id", tourController.getSingleTour);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.updateTour
);
router.delete("/:id", tourController.deleteTour);

export const tourRouter = router;

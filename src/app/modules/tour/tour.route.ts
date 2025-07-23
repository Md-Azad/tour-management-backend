import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validation } from "../../middlewares/responceValidation";
import { createTourTypeZodSchema } from "./tour.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validation(createTourTypeZodSchema),
  tourController.createTourType
);

router.get("/", tourController.getAllTourType);
router.get("/:id", tourController.getSingleTourType);
router.patch("/:id", tourController.updateTourType);
router.delete("/:id", tourController.deleteTourType);

export const tourRouter = router;

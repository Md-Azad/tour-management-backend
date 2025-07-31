import { Router } from "express";
import { divisionController } from "./division.controller";
import { validation } from "../../middlewares/responceValidation";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/create-division",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validation(createDivisionSchema),
  divisionController.createDivision
);
router.get("/", divisionController.getAllDivision);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validation(updateDivisionSchema),

  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);
router.get("/:slug", divisionController.getSingleDivision);

export const divisionRouter = router;

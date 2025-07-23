import { Router } from "express";
import { divisionController } from "./division.controller";
import { validation } from "../../middlewares/responceValidation";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create-division",
  validation(createDivisionSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.createDivision
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validation(updateDivisionSchema),
  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);
router.get("/", divisionController.getAllDivision);
router.get("/:slug", divisionController.getSingleDivision);

export const divisionRouter = router;

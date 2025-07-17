import { Router } from "express";
import { divisionController } from "./division.controller";
import { validation } from "../../middlewares/responceValidation";
import { createDivisionSchema } from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create-division",
  validation(createDivisionSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.createDivision
);
router.get("/:slug", divisionController.getSingleDivision);

export const divisionRouter = router;

import { Router } from "express";
import { userController } from "./user.controller";
import { validation } from "../../middlewares/responceValidation";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validation(createUserZodSchema),
  userController.createUser
);
router.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsers
);
router.get("/:id", userController.getSingleUser);
router.delete("/:id", userController.deleteUser);

export const userRouter = router;

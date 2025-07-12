import { Router } from "express";
import { userController } from "./user.controller";
import { validation } from "../../middlewares/responceValidation";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validation(createUserZodSchema),
  userController.createUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validation(updateUserZodSchema),
  userController.updateUser
);
router.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsers
);
router.get("/:id", userController.getSingleUser);
router.delete("/:id", userController.deleteUser);

export const userRouter = router;

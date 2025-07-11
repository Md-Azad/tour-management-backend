import { Router } from "express";
import { userController } from "./user.controller";
import { validation } from "../../middlewares/responceValidation";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validation(createUserZodSchema),
  userController.createUser
);
router.get("/all-users", userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.delete("/:id", userController.deleteUser);

export const userRouter = router;

import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.createUser);
router.get("/all-users", userController.getAllUsers);
router.get("/:id", userController.getSingleUser);

export const userRouter = router;

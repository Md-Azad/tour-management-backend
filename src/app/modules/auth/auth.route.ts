import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { validation } from "../../middlewares/responceValidation";
import { changePasswordZodSchema } from "./auth.validation";

const router = Router();

router.post("/login", authController.credentialLogin);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  authController.setPassword
);
router.post("/forget-password", authController.forgetPassword);
router.post(
  "/change-password",
  validation(changePasswordZodSchema),
  checkAuth(...Object.values(Role)),
  authController.changePassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = req.query.redirect;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirectTo as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallBack
);

export const authRouter = router;

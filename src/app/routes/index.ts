import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/division/division.routes";

export const router = Router();

const moduleRouter = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/division",
    route: divisionRouter,
  },
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.route);
});

import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/division/division.routes";
import { tourRouter } from "../modules/tour/tour.route";

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
  {
    path: "/tour",
    route: tourRouter,
  },
];

moduleRouter.forEach((route) => {
  router.use(route.path, route.route);
});

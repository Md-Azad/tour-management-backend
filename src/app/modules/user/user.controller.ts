import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { userServices } from "./user.services";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(StatusCodes.CREATED).send({
      message: "user created Successfully.",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
};

export const userController = {
  createUser,
};

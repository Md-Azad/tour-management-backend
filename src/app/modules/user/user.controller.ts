import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
    });

    res.status(StatusCodes.CREATED).send({
      message: "user created Successfully.",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    res
      .status(StatusCodes.BAD_GATEWAY)
      .send({ message: `something went wrong ${error.message}` });
  }
};

export const userController = {
  createUser,
};

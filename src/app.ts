import express, { Request, Response } from "express";
import "dotenv/config";
import { userRouter } from "./app/modules/user/user.routes";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Server is running for tour management." });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;

/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import { envVars } from "./app/config/env";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(`${envVars.DB_URL}`);
    console.log("connected to database");

    server = app.listen(5001, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("uncaughtException", (err) => {
  console.log("an uncaughtException occered", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("unhandledRejection", (err) => {
  console.log("an unhandledRejection occered", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("SIGTERM", () => {
  console.log("an SIGTERM occered");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("SIGINT", () => {
  console.log("an was close manually.");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

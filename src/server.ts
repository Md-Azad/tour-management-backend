/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(`${envVars.DB_URL}`);
    console.log("Connected to database");

    server = app.listen(5001, () => {
      console.log("Server is listening to port 5001");
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("uncaughtException", (err) => {
  console.log("An uncaughtException occered", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("unhandledRejection", (err) => {
  console.log("An unhandledRejection occered", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("SIGTERM", () => {
  console.log("An SIGTERM occered");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
process.on("SIGINT", () => {
  console.log("Server was close manually.");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

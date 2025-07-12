import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_EXPIRES: string;
  JWT_ACCESS_TOKEN: string;
  SALT_ROUND: number;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "JWT_EXPIRES",
    "JWT_ACCESS_TOKEN",
    "SALT_ROUND",
  ];

  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required env variables ${key}`);
    }
  });

  const saltRound = parseInt(process.env.SALT_ROUND as string, 10);
  if (isNaN(saltRound)) {
    throw new Error("SALT_ROUND must be a valid number");
  }
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_EXPIRES: process.env.JWT_EXPIRES as string,
    JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
    SALT_ROUND: saltRound,
  };
};

export const envVars = loadEnvVariables();

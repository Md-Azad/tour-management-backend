import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_EXPIRES: string;
  JWT_ACCESS_TOKEN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  SALT_ROUND: number;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  GOOGLE_CALLBACK_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "JWT_EXPIRES",
    "JWT_ACCESS_TOKEN",
    "SALT_ROUND",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "JWT_REFRESH_EXPIRES",
    "JWT_REFRESH_SECRET",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "EXPRESS_SESSION_SECRET",
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
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
  };
};

export const envVars = loadEnvVariables();

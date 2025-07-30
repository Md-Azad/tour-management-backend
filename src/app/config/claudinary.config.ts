import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLAUDINARY.CLOUDINARY_CLOUD_NAME,
  api_secret: envVars.CLAUDINARY.CLOUDINARY_API_SECRET,
  api_key: envVars.CLAUDINARY.CLOUDINARY_API_KEY,
});

export const claudinaryUpload = cloudinary;

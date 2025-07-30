import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import { Request } from "express";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req: Request, file: Express.Multer.File) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // remove spaces
        .replace(/\./g, "-") // remove .
        .replace(/[^a-z0-9\-\\.]/g, ""); //remode any non alphabetic and non numeric values

      const extention = file.originalname.split(".").pop();

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extention;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });

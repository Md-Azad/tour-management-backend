import { StatusCodes } from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { createOtp } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";

const sendOtp = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found.");
  }
  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are already verified.");
  }
  const otp = createOtp();
  const expiration = 2 * 60;
  const redisKey = `otp:${email}`;

  redisClient.set(redisKey, otp, {
    expiration: { type: "EX", value: expiration },
  });

  sendEmail({
    to: email,
    subject: "OTP Verification",
    templateName: "otp.ejs",
    templateData: {
      name: name,
      otp: otp,
      subject: "OTP Verification",
    },
  });
};
const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found.");
  }
  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You are already verified.");
  }
  const redisKey = `otp:${email}`;

  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP is not valid.");
  }

  if (storedOtp !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP is not valid.");
  }

  await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { runValidators: true }
  );

  redisClient.del(redisKey);
};

export const otpService = {
  sendOtp,
  verifyOtp,
};

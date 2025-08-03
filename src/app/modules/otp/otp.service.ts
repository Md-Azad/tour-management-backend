import { redisClient } from "../../config/redis.config";
import { createOtp } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/sendEmail";

const sendOtp = async (email: string, name: string) => {
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

export const otpService = {
  sendOtp,
};

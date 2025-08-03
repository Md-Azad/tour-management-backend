import crypto from "crypto";
export const createOtp = () => {
  const otp = crypto.randomInt(10 ** 5, 10 ** 6);

  return otp;
};

import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

export const verifyToken = (accessToken: string, secret: string) => {
  const isVerifiedToken = jwt.verify(accessToken, secret);
  return isVerifiedToken;
};

import { Response } from "express";
import { envVars } from "../config/env";

export interface IAuthInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthTokenToCookie = (res: Response, tokenInfo: IAuthInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};

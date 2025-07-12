import { Response } from "express";

export interface IAuthInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthTokenToCookie = (res: Response, tokenInfo: IAuthInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};

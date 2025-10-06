import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const setCookie = (res: Response, token: string) => {
   res.cookie("auth", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000, // 8h
   });

   res.cookie("flag", "1", {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000, // 8h
   });

   return res;
};

export const clearCookie = (res: Response) => {
   res.clearCookie("auth");
   res.clearCookie("flag");

   return res;
};

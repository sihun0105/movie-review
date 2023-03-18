import express, { Request, Response } from "express";
import passport from "passport";
import { SystemError } from "../interface/error.interface";
const router = express.Router();
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      const error: any = new Error("회원 정보가 없습니다.");
      error.status = 500;
      next(error);
      return;
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
export default router;

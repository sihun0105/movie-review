import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import dotenv from "dotenv";
import pageRouter from "./src/router/page.router";
import userRouter from "./src/router/user.router";
import authRouter from "./src/router/auth.router";
import { AppDataSource } from "./models/index";
import { SystemError } from "./src/interface/error.interface";
import * as redis from "redis";
import passport from "passport";
import * as passportConfig from "./passport/index";
import path = require("path");

dotenv.config();

const redisClient = redis.createClient({ legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)

AppDataSource.initialize()
  .then(() => {
    console.log("db connection...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
// app.set("view engine", "html");
// app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT);
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
passportConfig.default();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  next(error);
});
app.use((err: SystemError, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

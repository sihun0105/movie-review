import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import dotenv from "dotenv";
import { useExpressServer } from 'routing-controllers';
import {AuthController} from "./src/router/auth.router";
import { AppDataSource } from "./models/index";
import { ErrorHandler } from "./src/router/error.router";
import * as redis from "redis";
import path = require("path");

dotenv.config();

const redisClient = redis.createClient({ legacyMode: true });
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect().then();

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

useExpressServer(app, {
  controllers: [AuthController],
});
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

import express, {NextFunction, Request, Response} from 'express';
import cookieParser  from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import dotenv from "dotenv";
import pageRouter from './src/router/page';
import {AppDataSource} from './models/index';
import { SystemError } from './src/interface/error.interface';
import * as redis from 'redis';
dotenv.config();

const redisClient = redis.createClient({legacyMode: true }); // legacy 모드 반드시 설정 !!
redisClient.on('connect', () => {
   console.info('Redis connected!');
});
redisClient.on('error', (err) => {
   console.error('Redis Client Error', err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)

AppDataSource.initialize().then(()=>{
  console.log('db connection...')
}).catch((err)=>{
console.log(err)
})

const app = express();
app.set("port", process.env.PORT);

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
        httpOnly: false,
        secure: false,
      },
    })
  );
app.use("/",pageRouter);

app.use((req : Request, res : Response, next : NextFunction) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    next(error);
});
app.use((err : SystemError, req : Request, res : Response, next : NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기중");
});
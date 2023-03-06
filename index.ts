import express, {NextFunction, Request, Response} from 'express';
import cookieParser  from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import pageRouter from './router/page';

interface SystemError {
  message: string;
  status: number;
}
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
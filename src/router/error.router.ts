import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: NextFunction) {
    const status = error.httpCode || 500;
    res.status(status);
    res.json({
      message: error.message || 'Internal Server Error',
      code: status,
    });
    next();
  }
}

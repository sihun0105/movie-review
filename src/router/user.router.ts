import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ result: 222 });
});

export default router;

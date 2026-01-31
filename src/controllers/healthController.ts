import { Request, Response } from "express";

export const healthController = (req: Request, res: Response): void => {
  res.status(200).json({ status: "ok" });
};

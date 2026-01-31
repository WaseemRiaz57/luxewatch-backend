import { NextFunction, Request, Response } from "express";

// Basic error handler placeholder; expand with logging and structured errors later.
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

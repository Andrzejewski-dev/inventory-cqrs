import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

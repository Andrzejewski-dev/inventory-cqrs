import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { method, url } = req;
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    logger.info(`[${method}] ${url} ${status} - ${duration}ms`);
  });

  next();
};

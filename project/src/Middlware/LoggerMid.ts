import {Request, Response, NextFunction} from "express";
import {logger} from "../Utils/Logger"


export function logRequestToFile(req: Request, res: Response, next: NextFunction) {
  logger.info(`(${req.method}) http://localhost:3000/${req.url}`);
  const statusCode = res.statusCode || 500;
  logger.debug(`The request returned with status code: ${statusCode}`);
  next();
}
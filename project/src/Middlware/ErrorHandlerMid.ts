import {Request, Response, NextFunction} from "express";
import {logger} from "../Utils/Logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction)
{  
    const statusCode = err.status || 500;
    logger.error(`ERROR: ${err.message}`);
    return res.status(statusCode).json({ error: err.message || "Internal Server Error" });
}


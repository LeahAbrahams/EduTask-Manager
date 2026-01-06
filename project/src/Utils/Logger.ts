import winston from "winston";
import path from "path";

const date = new Date().toISOString().split("T")[0].split("-"); // 2025-04-06T12:34:56:876

const logFileName = path.join("logs", `app-${date[0]}-${date[1]}-${date[2]}.log`); // /logs/app-04-06-2025.log

export const logger = winston.createLogger({
  level: 'info',
  // error, worning, info, debug.
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY ~~~ HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new winston.transports.File({ filename: logFileName }),
  ],
});
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { logger } from '../../Utils/Logger';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '100d';

export const generateToken = (userId: string, role: string): string => {
    logger.info(`Generating token for userId: ${userId}, role: ${role}`);
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '100d' });
};

// פונקציה לבדיקת הטוקן ב-Middleware
export const verifyToken = (token: string): string | JwtPayload => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        logger.error(`Token verification failed: ${error}`);
        throw new Error("Invalid Token");
    }
};
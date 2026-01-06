import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../Routers/Authentication/JwtUtils';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or malformed Authorization header' });
    }

    const parts = authHeader.split(' ');
    const token = parts.length == 2 ? parts[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded;
        next();
    } catch (err: any) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};


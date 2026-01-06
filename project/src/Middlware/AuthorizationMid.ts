import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (requiredRole: 'Teacher' | 'Student') => {
    return (req: any, res: Response, next: NextFunction) => {

        if (!req.user || req.user.role != requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        next();
    };
};
import { Request, Response, NextFunction } from 'express';
import { User } from '../DB_Service/Users/UserModel';
import { logger } from '../Utils/Logger';

// פונקציה לבדיקת חוזק סיסמה: לפחות 8 תווים, אותיות ומספרים
function isStrongPassword(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // GeekforGeeks-ראינו בדיקה כזו ב
    logger.info('Password strength was checked');
    return regex.test(password);
}

// רישום משתמש חדש
export async function validateRegistration(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, userId, email, password, role } = req.body;

        // בדיקת חוזק סיסמה
        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters and contain both letters and numbers.' });
        }

        // userId בדיקת ייחודיות 
        const existingUserId = await User.findOne({ userId });
        if (existingUserId) {
            return res.status(400).json({ message: 'userId already exists.' });
        }

        // email בדיקת ייחודיות 
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // בדיקת תפקיד
        if (!['Teacher', 'Student'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        logger.info('Registration data validated successfully');
        next();
    } catch (error) {
        logger.error('Error validating registration data', error);
        next(error);
    }
}
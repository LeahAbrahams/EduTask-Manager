import { Router, Request, Response } from 'express';
import { generateToken } from './JwtUtils';
import { validateRegistration } from '../../Middlware/UserValidationMid';
import { UserService } from '../../DB_Service/Users/UserService';
import { logger } from '../../Utils/Logger';
import bcrypt from 'bcryptjs';

export const authRouter = Router();   

const userService = new UserService();

// רישום משתמש חדש
authRouter.post('/register', validateRegistration, async (req: Request, res: Response) => {
    const { name, userId, email, password, role } = req.body;
    try {
        const newUser = await userService.registerUser(name, userId, email, password, role);
        logger.info(`New user registered: ${name} with role: ${role}`);
        return res.status(201).json({ message: `User ${name} registered successfully` });
    } catch (error: any) {
        logger.error(`User registration failed: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
});

// התחברות משתמש קיים
authRouter.post('/login', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    try {
        console.log('Login attempt:', { name, email, password });
        
        // בדיקה מה יש במסד הנתונים
        const { User } = await import('../../DB_Service/Users/UserModel');
        const allUsers = await User.find({});
        console.log('All users in DB:', allUsers);
        
        const user = await User.findOne({ name, email });
        console.log('Found user:', user);
        
        if (!user) {
            throw new Error('Invalid name, email or password');
        }
        
        if (user.password !== password) {
            console.log('Password mismatch:', { stored: user.password, provided: password });
            throw new Error('Invalid name, email or password');
        }
        
        const token = generateToken(user.userId, user.role);
        logger.info(`User logged in: ${name}`);
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
        console.error('Login error:', error.message);
        logger.error(`User login failed: ${error.message}`);
        return res.status(401).json({ error: error.message });
    }
});
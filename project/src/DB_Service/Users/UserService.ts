import { IUser, User } from "../Users/UserModel";
import { Types } from 'mongoose';
import { promises } from "dns";
import { teacherRouter } from "../../Routers/Teacher/TeachrRouter";

export class UserService {
    // רישום משתמש חדש
    async registerUser(name: string, userId: string, email: string, password: string, role: string): Promise<IUser> {
        // בדיקה אם המשתמש כבר קיים לפי userId או email
        const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
        if (existingUser) {
            throw new Error('User with this userId or email already exists');
        }
        const newUser = new User({ name, userId, email, password, role });
        await newUser.save();
        return newUser;
    }
    // פונקציה לאימות משתמש קיים
    async authenticateUser(name: string, email?: string, password?: string): Promise<IUser> {
        const user = await User.findOne({ name, email });
        if (!user) {
            throw new Error('Invalid name, email or password');
        }
        if (user.password !== password) {
            throw new Error('Invalid name, email or password');
        }
        return user as IUser;
    }
}
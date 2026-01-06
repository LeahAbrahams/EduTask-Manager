import mongoose, {Schema, Types} from 'mongoose';
import { UserService } from '../Users/UserService';

export interface IUser {
    userId: string;
    name: string;
    email: string;
    password: string;
    role: 'Student' | 'Teacher';
}

export const userSchema = new Schema ({
    userId: {type: Schema.Types.String, required: true}, //, ref: 'Submission'
    name: {type: Schema.Types.String, required: true},
    email: {type: Schema.Types.String},
    password: {type: Schema.Types.String, required: true},
    role: {type: Schema.Types.String, enum: ['Student', 'Teacher'], required: true}, 
});

export const User = mongoose.model<IUser>('User', userSchema);
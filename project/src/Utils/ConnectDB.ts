import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export class myDB{
    static DB: myDB = new myDB();
    URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ShiraShakarov&LeahleAbrahams';

    async connectToDb(): Promise<void> {
        try {
            await mongoose.connect(this.URI);
            console.log('Connected to MongoDB (Mongoose)');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    }

    static getDB(): myDB
    {
        if( mongoose.connection.readyState === 0)
            this.DB.connectToDb();
        return this.DB;
    }
}
import express, { Request, Response }  from 'express';
import {myDB} from './Utils/ConnectDB';
import { authRouter } from './Routers/Authentication/AuthenticationRouter';
import { studentRouter } from './Routers/Student/StudentRouter';
import { teacherRouter } from './Routers/Teacher/TeachrRouter';

const app = express();

// for the angular
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
// end of angular

app.use(express.json());
myDB.getDB();

app.use('/auth', authRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);

app.use((err: Error, req: Request , res: Response, next: any) => {
    res.status(500).send(err);
});

export default app;

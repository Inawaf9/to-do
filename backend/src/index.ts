import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth.route';
import listRouter from './routes/list.route';
import taskRouter from './routes/task.route';
import publicRouter from './routes/public.route';
import userRouter from './routes/user.route';

import connectMongoDB  from './config/db';
import { authMiddleware } from "./middleware/isAuthenticated";
import errorHandler from './middleware/errorHandling';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());



app.use('/api/auth', authRouter);
app.use('/api/share', publicRouter);

app.use(authMiddleware);

app.use('/api/lists', listRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/profile', userRouter);

app.use(errorHandler);

connectMongoDB().then(() => {
    app.listen(port);
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});
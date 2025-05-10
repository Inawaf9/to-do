import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';



import authRouter from './routes/auth';
import listRouter from './routes/list';
import taskRouter from './routes/task';
import sharedRouter from './routes/shared';
import connectMongoDB  from './config/db';
import { IsAuthenticated } from "./middleware/isAuthenticated";


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

connectMongoDB();

app.use('/api/auth', authRouter);

app.use(IsAuthenticated);
app.use('/api/todos', listRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/shared', sharedRouter);



app.listen(port);
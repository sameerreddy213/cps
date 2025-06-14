/* AUTHOR - NIKITA S RAJ KAPINI (CREATED ON 10/06/2025) */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assessmentRoutes } from './routes/assessment';
import { responseRoutes } from './routes/response';
import chatRoutes from './routes/chat';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/assessment', assessmentRoutes);
app.use('/api/response', responseRoutes);
app.use('/api/chat', chatRoutes);
mongoose.connect(process.env.MONGO_URI!)
  .then(() => app.listen(5000, () => console.log('Server running')))
  .catch(err => console.error(err));

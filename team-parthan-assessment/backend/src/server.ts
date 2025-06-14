import express, { json } from 'express';
const app = express();
import apiRoutes from './routes/analyzeRoute';
//import authRoutes from './routes/authRoute';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

app.use(cors());
app.use(json());
app.use('/api', apiRoutes);

//app.use('/api/auth', authRoutes);

// Error handling middleware
interface ErrorWithStack extends Error {
  stack?: string;
}

app.use((err: ErrorWithStack, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
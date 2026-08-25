import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db';
import userRouter from './router/userRouter'
import submissionRouter from './router/submissionRouter';
import courseController from './controller/courseController';
import examRouter from './router/examRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/submissions', submissionRouter);
app.use('/api/exams', examRouter);
app.use('/api/courses', courseController);
app.use ('/api/students', userRouter)

app.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({ message: 'Hello World!', users: result.rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`[serveur]: Serveur démarré sur http://localhost:${PORT}`);
});
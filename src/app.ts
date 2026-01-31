import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';

const app: Application = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// 👇 FIX: Use process.cwd() for robust path resolution
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 3. BODY PARSER
app.use(express.json());

// Error Handlers...
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('❌ Invalid JSON payload:', (err as any).message);
    res.status(400).json({ message: 'Invalid JSON format' });
    return;
  }
  next(err as Error);
});

// 4. ROUTES
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Luxury Watch API is Working! 🚀');
});

export default app;
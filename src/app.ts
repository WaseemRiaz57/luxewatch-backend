import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // 👈 Ye package zaroori hai
import helmet from 'helmet';
import path from 'path';
import routes from './routes';

const app: Application = express();

// 1. GLOBAL MIDDLEWARE
// 👇 UPDATE: 'origin: true' ka matlab hai ke har incoming request allow hai.
// Ye Vercel ke random preview URLs ke liye best solution hai.
app.use(cors({
  origin: true, 
  credentials: true
}));

// Helmet: Images load karne ke liye zaroori
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// 2. STATIC FILES
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

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Luxury Watch API is Working! 🚀');
});

export default app;
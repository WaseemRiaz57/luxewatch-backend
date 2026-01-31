import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';

const app: Application = express();

// 1. GLOBAL MIDDLEWARE
// 👇 UPDATE: Sirf apne Vercel domain ko allow karein
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://client-tau-neon.vercel.app" // 👈 Aapka Vercel domain
  ],
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// 2. STATIC FILES
// Development ke liye sahi hai, lekin Production (Render) par Cloudinary best hai
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
import jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY: jwt.SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRY || '7d') as jwt.SignOptions['expiresIn'];

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

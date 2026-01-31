import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

export interface ProtectedRequest extends Request {
  user?: JwtPayload;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  file?: Express.Multer.File;
}

/**
 * Middleware to verify JWT token and attach user to request
 * Extract token from Authorization header: Bearer <token>
 */
export const protect = (req: ProtectedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header provided' });
      return;
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ message: 'Invalid authorization header format' });
      return;
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({
      message: 'Invalid or expired token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Middleware to check user role
 * Usage: restrict('admin', 'staff')
 */
export const restrict = (...roles: string[]) => {
  return (req: ProtectedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

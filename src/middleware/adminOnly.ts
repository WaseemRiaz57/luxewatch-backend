import { Response, NextFunction } from 'express';
import { ProtectedRequest } from './protect';

/**
 * Middleware to verify that the user is an admin
 * Must be used after the 'protect' middleware
 * Returns 403 Forbidden if user is not an admin
 */
export const adminOnly = (req: ProtectedRequest, res: Response, next: NextFunction): void => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      res.status(403).json({
        message: 'Forbidden: Only administrators can access this resource',
      });
      return;
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

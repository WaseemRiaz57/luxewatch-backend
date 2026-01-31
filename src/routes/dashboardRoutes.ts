import { Router } from 'express';
import { getDashboardStats, getOrderStats } from '../controllers/dashboardController';
import { protect } from '../middleware/protect';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

// All dashboard routes require authentication and admin role
router.use(protect, adminOnly);

// Get comprehensive dashboard statistics
router.get('/stats', getDashboardStats);

// Get order statistics breakdown
router.get('/orders-stats', getOrderStats);

export default router;

import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import adminProductRoutes from './adminProductRoutes';
import dashboardRoutes from './dashboardRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.get('/health', healthController);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/admin/dashboard', dashboardRoutes);

export default router;

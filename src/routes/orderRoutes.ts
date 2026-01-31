import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  updateOrderStatus,
  getOrders,
  getAllOrders,
  getAdminStats,
  deleteOrder,
  updatePaymentStatus
} from '../controllers/orderController';
import { protect } from '../middleware/protect';
import { adminOnly } from '../middleware/adminOnly';

const router = Router();

// Admin routes - MUST come before generic routes
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, adminOnly, updatePaymentStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

// User routes (protected)
router.get('/', protect, adminOnly, getOrders);
router.post('/', createOrder); // Public route - Guest checkout
router.get('/:id', getOrderById); // Public route - Guest can check order status

export default router;
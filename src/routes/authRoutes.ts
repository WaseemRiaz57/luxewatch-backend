import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { protect } from '../middleware/protect';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

export default router;

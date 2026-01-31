import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/adminProductController';
import { protect } from '../middleware/protect';
import { adminOnly } from '../middleware/adminOnly';
import multer from 'multer';
import storage from '../config/cloudinary';

const router = Router();

const upload = multer({ storage });

// All admin product routes require authentication and admin role
router.use(protect, adminOnly);

// Create product with multiple image upload (max 10 images)
router.post('/', upload.array('images', 10), createProduct);

// Update product with multiple image upload (max 10 images)
router.put('/:id', upload.array('images', 10), updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;

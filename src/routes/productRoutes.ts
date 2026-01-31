import { Router } from 'express';
import multer from 'multer';
import { getProducts, getProductById, getFeaturedProducts, addReview, updateProduct } from '../controllers/productController';
import { protect } from '../middleware/protect';
import { adminOnly } from '../middleware/adminOnly';
import storage from '../config/cloudinary';

const router = Router();

const upload = multer({ storage });

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.post('/:id/reviews', protect, addReview);

export default router;

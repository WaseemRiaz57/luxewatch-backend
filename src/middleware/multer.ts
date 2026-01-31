import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create temp directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to only accept image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`));
  }
};

/**
 * Multer middleware configuration for single file upload
 */
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single('image');

/**
 * Multer middleware configuration for multiple file upload
 */
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).array('images', 10); // Max 10 images per request

/**
 * Cleanup function to delete temp files after upload
 */
export const cleanupTempFiles = (files: Express.Multer.File[] | Express.Multer.File | undefined) => {
  if (!files) return;

  const fileArray = Array.isArray(files) ? files : [files];
  fileArray.forEach((file) => {
    if (file && file.path) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Failed to delete temp file: ${file.path}`, err);
      });
    }
  });
};

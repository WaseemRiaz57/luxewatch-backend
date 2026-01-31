import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// 👇 1. Zabardasti .env file load karein
// (Ye ensure karega ke keys mil jayen, chahe app abhi start hi hui ho)
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

// 👇 2. Debugging (Check karein keys load huin ya nahi)
console.log("🔍 Checking Cloudinary Config...");
console.log("☁️ Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Loaded" : "❌ MISSING");
console.log("🔑 API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ MISSING");

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luxury-watches',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
  } as any,
});

export default storage;
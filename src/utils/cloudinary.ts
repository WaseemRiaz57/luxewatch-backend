import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a single image file to Cloudinary
 * @param filePath - Local file path of the image
 * @param folder - Cloudinary folder (e.g., 'luxury-watch-saas/products')
 * @returns Promise with upload result containing secure_url
 */
export const uploadImage = async (filePath: string, folder: string = 'luxury-watch-saas/products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${String(error)}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param filePaths - Array of local file paths
 * @param folder - Cloudinary folder
 * @returns Promise with array of upload results
 */
export const uploadMultipleImages = async (filePaths: string[], folder: string = 'luxury-watch-saas/products') => {
  try {
    const uploadPromises = filePaths.map((filePath) => uploadImage(filePath, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${String(error)}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - Public ID of the image in Cloudinary
 */
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${String(error)}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs
 */
export const deleteMultipleImages = async (publicIds: string[]) => {
  try {
    const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
    return await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`Multiple image deletion failed: ${String(error)}`);
  }
};

import { Request, Response } from 'express';
import Product from '../models/Product';

// ✅ Interface Yahan Define Kar Diya (Import Error se bachne ke liye)
interface ProtectedRequest extends Request {
  user?: any;
  files?: any;
}

/**
 * Admin only: Create a new product with images
 */
export const createProduct = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    console.log("🚀 Create Product Request Started...");
    
    // 1. Files Check
    // Agar Multer fail hua to ye empty hoga
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
       console.log("❌ Error: No files received in req.files");
       res.status(400).json({ message: 'At least one image is required' });
       return;
    }

    // 2. Extract Images
    const imagePaths = (req.files as Express.Multer.File[]).map((file) => file.path);
    console.log(`📸 Received ${imagePaths.length} Images`);

    const { 
      modelName, 
      brand, 
      price, 
      description, 
      stock, 
      category, 
      movement, 
      caseSize, 
      waterResistance,
      condition 
    } = req.body;

    // 3. Generate SKU (Random Unique ID)
    const randomSku = Math.floor(1000 + Math.random() * 9000);
    const sku = `${brand?.substring(0, 3).toUpperCase() || 'GEN'}-${modelName?.substring(0, 3).toUpperCase() || 'MOD'}-${randomSku}`;

    // 4. Create Product Object
    const product = new Product({
      brand,
      modelName,
      sku: sku, 
      price: Number(price),
      description,
      stock: Number(stock || 0),
      
      // ✅ Enums Fix: Lowercase for database validation ('New' -> 'new')
      condition: (condition || 'new').toLowerCase(), 
      movement: (movement || 'automatic').toLowerCase(),
      
      caseSize: caseSize || '42mm',
      waterResistance: waterResistance || '300m',
      sapphireGlass: true,
      
      images: imagePaths, // ✅ Saving Image URLs
      
      // ❌ CATEGORY TEMPORARILY DISABLED
      // Kyunke Frontend string bhej raha hai aur Backend ID maang raha hai -> Ye crash kar raha tha
      // category: null, 
      
      isFeatured: false
    });

    const savedProduct = await product.save();
    console.log("✅ SUCCESS: Product Created:", savedProduct._id);

    res.status(201).json(savedProduct);

  } catch (error: any) {
    console.error("❌ SERVER ERROR DETECTED:", error);

    // Agar Mongoose Validation Fail ho rahi hai to batao kaunsi field hai
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
      return;
    }

    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

// ✅ Update Product with full file support and image deletion
/**
 * Admin only: Update product
 */
export const updateProduct = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Product dhoondein
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // 2. Naya Data Extract Karein
    const { 
      modelName, 
      brand, 
      price, 
      description, 
      stock, 
      category, 
      movement, 
      caseSize, 
      waterResistance,
      condition,
      isFeatured,
      existingImages
    } = req.body;

    // 3. Fields Update Karein (Jo data aya hai sirf wahi update ho)
    if (modelName) product.modelName = modelName;
    if (brand) product.brand = brand;
    if (price) product.price = Number(price);
    if (description) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (movement) product.movement = movement.toLowerCase();
    if (caseSize) product.caseSize = caseSize;
    if (waterResistance) product.waterResistance = waterResistance;
    if (condition) product.condition = condition.toLowerCase();
    
    // Featured Status Update
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // 4. Image Management: Handle both kept and new images
    const finalImages: string[] = [];

    // Parse existing images from frontend (images user chose to KEEP)
    if (existingImages) {
      if (typeof existingImages === 'string') {
        // Single image as string
        finalImages.push(existingImages);
      } else if (Array.isArray(existingImages)) {
        // Multiple images as array
        finalImages.push(...existingImages.filter((img) => img && typeof img === 'string'));
      }
    }

    // Append new uploaded files
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
      finalImages.push(...newImageUrls);
      console.log(`📸 Added ${newImageUrls.length} new images`);
    }

    // Validate: Ensure at least one image exists
    if (finalImages.length === 0) {
      res.status(400).json({ message: 'At least one image is required' });
      return;
    }

    // Update the product images with final list
    product.images = finalImages;
    console.log(`✅ Final image list: ${finalImages.length} images`);

    // 5. Save Changes
    const updatedProduct = await product.save();
    console.log("✅ Product Updated:", updatedProduct._id);

    res.status(200).json(updatedProduct);

  } catch (error: any) {
    console.error("❌ Update Error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
      return;
    }

    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

/**
 * Admin only: Delete a product
 */
export const deleteProduct = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    // Delete product from database
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Check if product was found
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};
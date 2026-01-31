import { Request, Response } from 'express';
import Product from '../models/Product';
import { ProtectedRequest } from '../middleware/protect';

// 👇 YEH HAI WO MISSING FUNCTION JO ERROR FIX KAREGA 👇
export const createProduct = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    console.log('📝 Create Product Body:', req.body);
    console.log('📁 Create Product File:', req.file);

    // 1. Image Validation (File req.file mein hoti hai, body mein nahi)
    if (!req.file) {
      res.status(400).json({ message: 'Product image is required' });
      return;
    }

    // 2. Extract Fields (FormData se strings milti hain)
    const { 
      modelName, 
      brand, 
      description, 
      price, 
      stock, 
      countInStock,
      movement, 
      caseSize, 
      waterResistance 
    } = req.body;

    // 3. Validate Required Fields
    if (!modelName || !brand || !description || !price) {
      res.status(400).json({ message: 'Please fill in all required fields' });
      return;
    }

    // 4. Create Product Object
    // Note: Price aur Stock ko Number() mein convert karna zaroori hai
    const product = new Product({
      user: (req.user as any)?._id, // User ID from protected middleware
      modelName,
      brand,
      image: req.file.path, // Cloudinary URL
      images: [req.file.path], // Array field (future proofing)
      description,
      brandCategory: 'Luxury', 
      category: 'Watches', // Default category
      price: Number(price),
      countInStock: Number(stock || countInStock || 0),
      rating: 0,
      numReviews: 0,
      movement: movement || 'Automatic',
      caseSize: caseSize || '42mm',
      waterResistance: waterResistance || '30m',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error: any) {
    console.error('❌ Create Product Error:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

// --- BAQI FUNCTIONS (As provided by you) ---

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, condition, minPrice, maxPrice, movement, page = 1, limit = 12, search } = req.query;

    const filter: Record<string, any> = {};
    if (brand) filter.brand = brand;
    if (condition) filter.condition = condition;
    if (movement) filter.movement = movement;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('category');

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category').populate('reviews.userId', 'firstName lastName');

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8).populate('category');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const updateProduct = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Note: Agar aap Edit page par bhi Image upload lagayenge, to isay bhi 
    // createProduct ki tarah req.file check karna parega.
    const {
      modelName,
      brand,
      price,
      description,
      stock,
      images,
      movement,
      caseSize,
      waterResistance,
      sapphireGlass,
      condition,
      dialColor,
      material,
      warranty,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (modelName !== undefined) product.modelName = modelName;
    if (brand !== undefined) product.brand = brand;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;
    if (movement !== undefined) product.movement = movement;
    if (caseSize !== undefined) product.caseSize = caseSize;
    if (waterResistance !== undefined) product.waterResistance = waterResistance;
    if (sapphireGlass !== undefined) product.sapphireGlass = sapphireGlass;
    if (condition !== undefined) product.condition = condition;
    if (dialColor !== undefined) product.dialColor = dialColor;
    if (material !== undefined) product.material = material;
    if (warranty !== undefined) product.warranty = warranty;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;
    if (metaKeywords !== undefined) product.metaKeywords = metaKeywords;

    if (req.file?.path) {
      product.images = [req.file.path];
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const addReview = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ message: 'Rating and comment are required' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const review = {
      userId: req.user.userId,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review as any);

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.avgRating = totalRating / product.reviews.length;
    product.reviewCount = product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};
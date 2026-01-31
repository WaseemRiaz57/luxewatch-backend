import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  brand: string;
  modelName: string;
  sku: string;
  price: number;
  discountPrice?: number;
  condition: 'new' | 'pre-owned';
  movement: 'automatic' | 'quartz';
  caseSize: string;
  sapphireGlass: boolean;
  images: string[];
  stock: number;
  isFeatured: boolean;
  description?: string;
  dialColor?: string;
  waterResistance?: string;
  material?: string;
  warranty?: string;
  category?: mongoose.Types.ObjectId;
  reviews: IReview[];
  avgRating: number;
  reviewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new Schema<IProduct>(
  {
    brand: { type: String, required: true },
    modelName: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    condition: {
      type: String,
      enum: ['new', 'pre-owned'],
      default: 'new',
      required: true,
    },
    movement: {
      type: String,
      enum: ['automatic', 'quartz'],
      required: true,
    },
    caseSize: { type: String, required: true }, // e.g., "42mm"
    sapphireGlass: { type: Boolean, default: true },
    images: { type: [String], required: true }, // Array of Cloudinary URLs
    stock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    description: String,
    dialColor: String,
    waterResistance: String,
    material: String,
    warranty: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  { timestamps: true }
);

// Index for better query performance
productSchema.index({ brand: 1, condition: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });

export default mongoose.model<IProduct>('Product', productSchema);

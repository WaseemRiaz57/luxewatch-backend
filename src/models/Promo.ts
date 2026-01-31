import mongoose, { Schema, Document } from 'mongoose';

export interface IPromo extends Document {
  code: string;
  discountPercentage: number;
  discountAmount?: number;
  minPurchaseAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoSchema = new Schema<IPromo>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercentage: { type: Number, min: 0, max: 100 },
    discountAmount: Number,
    minPurchaseAmount: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPromo>('Promo', promoSchema);

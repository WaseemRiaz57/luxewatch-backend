import mongoose, { Document, Schema } from 'mongoose';

// 1. Define the Interface
export interface IOrder extends Document {
  user: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country?: string;
  };
  orderItems: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
    product?: mongoose.Schema.Types.ObjectId; // Made optional (?)
  }>;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: string;
}

// 2. Define the Schema
const orderSchema = new Schema<IOrder>(
  {
    user: {
      name: { type: String, required: false }, // Relaxed
      email: { type: String, required: false }, // Relaxed
      phone: { type: String, required: false },
      address: { type: String, required: false }, // Relaxed
      city: { type: String, required: false }, // Relaxed
      zip: { type: String, required: false }, // Relaxed
      country: { type: String },
    },
    orderItems: [
      {
        name: { type: String, required: false },
        qty: { type: Number, required: false },
        image: { type: String, required: false }, // Ab image missing hone par error nahi ayega
        price: { type: Number, required: false },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: false, // ✅ CRITICAL FIX: ID missing hone par bhi save karega
          ref: 'Product',
        },
      },
    ],
    paymentMethod: { type: String, required: false, default: 'Cash' },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: { type: Number, required: false, default: 0.0 },
    shippingPrice: { type: Number, required: false, default: 0.0 },
    totalPrice: { type: Number, required: false, default: 0.0 }, // Relaxed
    isPaid: { type: Boolean, required: false, default: false }, // Relaxed
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: false, default: false }, // Relaxed
    deliveredAt: { type: Date },
    status: { type: String, required: false, default: 'Processing' }, // Relaxed
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
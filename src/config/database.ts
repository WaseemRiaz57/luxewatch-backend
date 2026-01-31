import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI?.substring(0, 50) + '...');
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      retryWrites: true,
      w: 'majority',
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;

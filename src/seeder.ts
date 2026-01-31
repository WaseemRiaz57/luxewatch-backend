import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAdminUser = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGO_URI);

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail.toLowerCase(),
      password: '123456',
      role: 'admin',
      isVerified: true,
    });

    await adminUser.save();

    console.log('Admin User Created!');
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdminUser();

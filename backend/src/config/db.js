import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB connection (${env.MONGODB_URI}) failed: ${err.message}`);
    console.log('💡 Running with In-Memory fallback store so you can evaluate all features immediately.');
    console.log('👉 To connect to MongoDB Atlas, update MONGODB_URI in backend/.env with your cluster URI.');
    return null;
  }
};

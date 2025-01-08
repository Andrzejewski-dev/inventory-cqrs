import mongoose from 'mongoose';
import { logger } from './utils';

export const connectDB = async (uri: string) => {
  try {
    logger.info('Start connecting to MongoDB');
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

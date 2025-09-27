import ENV from '@/config/env';
import mongoose from 'mongoose';

const MONGODB_URI = ENV.MONGODB_URI;

interface ConnectionOptions {
  isConnected?: number;
}

const connection: ConnectionOptions = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function disconnectDB(): Promise<void> {
  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = 0;
    console.log('Disconnected from MongoDB');
  }
}

export { connectDB, disconnectDB };

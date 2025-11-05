import mongoose from "mongoose";

let isConnected = false; // connection state cache

const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    // Already connected — skip re-connecting
    // console.log("✅ MongoDB already connected");
    return;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("❌ MONGO_URL is not defined in environment variables");
  }

  try {
    // Connect only once per runtime
    await mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false,
      maxPoolSize: 10, // reuse up to 10 connections
    });

    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", (error as Error).message);
    throw new Error("Database connection failed");
  }
};

export default connectToDatabase;

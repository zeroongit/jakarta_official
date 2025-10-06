import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Gagal koneksi MongoDB:", error);
    throw new Error("Gagal koneksi MongoDB");
  }
};

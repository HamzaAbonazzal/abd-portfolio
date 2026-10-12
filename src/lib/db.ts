import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  // ✅ التحقق داخل الدالة (وليس في مستوى الوحدة)
  if (!MONGODB_URI) {
    throw new Error(
      "❌ MONGODB_URI is not defined. Please add it to Vercel Environment Variables (or .env.local for local dev)."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Connecting to MongoDB...");

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ MongoDB Connected Successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
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
  // ============================================
  // تشخيص شامل في Console
  // ============================================
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 MongoDB Connection Diagnostics");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📌 NODE_ENV:", process.env.NODE_ENV);
  console.log("📌 VERCEL_ENV:", process.env.VERCEL_ENV || "(not on Vercel)");
  console.log(
    "📌 MONGODB_URI:",
    MONGODB_URI
      ? `✅ exists (length: ${MONGODB_URI.length}, starts with: ${MONGODB_URI.substring(0, 20)}...)`
      : "❌ NOT FOUND"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // ✅ التحقق داخل الدالة
  if (!MONGODB_URI) {
    console.error("❌ CRITICAL: MONGODB_URI is not defined!");
    console.error("   → Add it in Vercel → Settings → Environment Variables");
    console.error("   → Or in .env.local for local development");
    console.error("   → Then REDEPLOY (without cache)");
    throw new Error(
      "MONGODB_URI is not defined. Please add it to Vercel Environment Variables and redeploy."
    );
  }

  // إذا كان الاتصال موجوداً مسبقاً
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // إنشاء وعد الاتصال
  if (!cached.promise) {
    console.log("🔌 Establishing new MongoDB connection...");

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 ثوان
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected Successfully!");
        console.log("📌 Database name:", m.connection.name);
        console.log("📌 Host:", m.connection.host);
        return m;
      })
      .catch((err) => {
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("❌ MONGODB CONNECTION FAILED");
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("Error name:", err?.name);
        console.error("Error message:", err?.message);
        console.error("");
        console.error("🔍 Common causes:");
        console.error("   1. Invalid connection string (check username/password)");
        console.error("   2. IP not whitelisted in MongoDB Atlas");
        console.error("      → Go to Atlas → Network Access → Add 0.0.0.0/0");
        console.error("   3. Cluster is paused or deleted");
        console.error("   4. Wrong database user credentials");
        console.error("   5. Special characters in password not URL-encoded");
        console.error("      → @ should be %40, # should be %23, etc.");
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    const SETUP_KEY = process.env.ADMIN_SETUP_KEY;
    const MONGODB_URI = process.env.MONGODB_URI;
    const JWT_SECRET = process.env.JWT_SECRET;

    // ✅ التشخيص: فحص وجود المتغيرات الأساسية
    const diagnostics = {
      ADMIN_SETUP_KEY: SETUP_KEY
        ? `✅ exists (length: ${SETUP_KEY.length})`
        : "❌ NOT FOUND",
      MONGODB_URI: MONGODB_URI
        ? `✅ exists (length: ${MONGODB_URI.length})`
        : "❌ NOT FOUND",
      JWT_SECRET: JWT_SECRET
        ? `✅ exists (length: ${JWT_SECRET.length})`
        : "❌ NOT FOUND",
      NODE_ENV: process.env.NODE_ENV || "unknown",
      VERCEL_ENV: process.env.VERCEL_ENV || "unknown",
    };

    // إذا لم يُرسل مفتاح، أرجع التشخيص
    if (!key) {
      return NextResponse.json({
        success: false,
        message: "Diagnostics mode - add ?key=YOUR_KEY to create admin",
        diagnostics,
      });
    }

    // 1. التحقق من وجود المفتاح السري
    if (!SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ADMIN_SETUP_KEY is not configured in environment variables. Please add it in Vercel → Settings → Environment Variables, then Redeploy (without cache).",
          diagnostics,
        },
        { status: 500 }
      );
    }

    // 2. التحقق من صحة المفتاح
    if (key !== SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid setup key",
          hint: "The key you provided does not match ADMIN_SETUP_KEY value.",
          diagnostics,
        },
        { status: 401 }
      );
    }

    // 3. الاتصال بقاعدة البيانات
    await connectDB();

    // 4. بيانات الأدمن
    const adminEmail = process.env.ADMIN_EMAIL || "abdulwahid@designer.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "abdulwahid@123456";
    const adminName = process.env.ADMIN_NAME || "Admin";

    // 5. التحقق من وجود الأدمن مسبقاً
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        credentials: {
          email: existing.email,
          url: "/ar/admin/login",
        },
        hint: "Use the existing password to login.",
        diagnostics,
      });
    }

    // 6. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 7. إنشاء الأدمن
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "✅ Admin user created successfully",
      credentials: {
        email: adminEmail,
        password: adminPassword,
        url: "/ar/admin/login",
      },
      warning:
        "⚠️ Change the password after first login, then delete this route or remove ADMIN_SETUP_KEY from Vercel.",
      userId: admin._id,
      diagnostics,
    });
  } catch (error: any) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
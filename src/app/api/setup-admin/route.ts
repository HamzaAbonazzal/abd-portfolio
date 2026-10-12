import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * API Route لإنشاء مستخدم الأدمن الأولي.
 * محمي بمفتاح سري في الـ query string.
 *
 * الاستخدام:
 * GET /api/setup-admin?key=YOUR_SETUP_KEY
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    const SETUP_KEY = process.env.ADMIN_SETUP_KEY;

    // 1. التحقق من وجود المفتاح السري
    if (!SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "ADMIN_SETUP_KEY is not configured in environment variables",
        },
        { status: 500 }
      );
    }

    // 2. التحقق من صحة المفتاح المُرسل
    if (!key || key !== SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing setup key" },
        { status: 401 }
      );
    }

    // 3. الاتصال بقاعدة البيانات
    await connectDB();

    // 4. بيانات الأدمن الافتراضية
    const adminEmail = process.env.ADMIN_EMAIL || "abdulwahid@designer.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "abdulwahid@123456";
    const adminName = process.env.ADMIN_NAME || "Admin";

    // 5. التحقق من وجود الأدمن مسبقاً
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        email: existing.email,
        hint: "Use the existing password to login, or delete the user from MongoDB Atlas to recreate.",
      });
    }

    // 6. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 7. إنشاء المستخدم
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
      warning: "⚠️ Change the password after first login, and delete this route if desired.",
      userId: admin._id,
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
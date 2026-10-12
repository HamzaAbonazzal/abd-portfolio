import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`\n🚀 [${requestId}] setup-admin request received`);

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // ============================================
    // 1. فحص جميع المتغيرات
    // ============================================
    const SETUP_KEY = process.env.ADMIN_SETUP_KEY;
    const MONGODB_URI = process.env.MONGODB_URI;
    const JWT_SECRET = process.env.JWT_SECRET;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_NAME = process.env.ADMIN_NAME;

    const diagnostics = {
      environment: {
        NODE_ENV: process.env.NODE_ENV || "unknown",
        VERCEL_ENV: process.env.VERCEL_ENV || "not on Vercel",
      },
      variables: {
        ADMIN_SETUP_KEY: SETUP_KEY
          ? `✅ exists (length: ${SETUP_KEY.length})`
          : "❌ NOT FOUND",
        MONGODB_URI: MONGODB_URI
          ? `✅ exists (length: ${MONGODB_URI.length}, prefix: ${MONGODB_URI.substring(0, 25)}...)`
          : "❌ NOT FOUND",
        JWT_SECRET: JWT_SECRET
          ? `✅ exists (length: ${JWT_SECRET.length})`
          : "❌ NOT FOUND",
        ADMIN_EMAIL: ADMIN_EMAIL
          ? `✅ custom (${ADMIN_EMAIL})`
          : "⚠️ default (admin@designer.com)",
        ADMIN_PASSWORD: ADMIN_PASSWORD
          ? `✅ custom (length: ${ADMIN_PASSWORD.length})`
          : "⚠️ default (Admin@123456)",
        ADMIN_NAME: ADMIN_NAME
          ? `✅ custom (${ADMIN_NAME})`
          : "⚠️ default (Admin)",
      },
      request: {
        hasKey: !!key,
        keyLength: key?.length || 0,
      },
    };

    console.log(`[${requestId}] Diagnostics:`, JSON.stringify(diagnostics, null, 2));

    // ============================================
    // 2. إذا لم يُرسل مفتاح، أرجع التشخيص فقط
    // ============================================
    if (!key) {
      return NextResponse.json({
        success: false,
        message: "🔍 Diagnostics mode - add ?key=YOUR_KEY to create admin",
        diagnostics,
      });
    }

    // ============================================
    // 3. فحص ADMIN_SETUP_KEY
    // ============================================
    if (!SETUP_KEY) {
      console.error(`[${requestId}] ❌ ADMIN_SETUP_KEY is missing`);
      return NextResponse.json(
        {
          success: false,
          error: "ADMIN_SETUP_KEY is not configured",
          action:
            "Add ADMIN_SETUP_KEY in Vercel → Settings → Environment Variables, then REDEPLOY (without cache)",
          diagnostics,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 4. فحص صحة المفتاح
    // ============================================
    if (key !== SETUP_KEY) {
      console.error(`[${requestId}] ❌ Invalid setup key`);
      console.error(`   Expected length: ${SETUP_KEY.length}`);
      console.error(`   Received length: ${key.length}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid setup key",
          hint: "The ?key= value does not match ADMIN_SETUP_KEY in Vercel",
          diagnostics,
        },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] ✅ Setup key validated`);

    // ============================================
    // 5. الاتصال بقاعدة البيانات
    // ============================================
    console.log(`[${requestId}] 🔌 Connecting to database...`);

    try {
      await connectDB();
      console.log(`[${requestId}] ✅ Database connected`);
    } catch (dbError: any) {
      console.error(`[${requestId}] ❌ Database connection failed:`, dbError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: dbError?.message || "Unknown DB error",
          action: "Check Vercel logs and MongoDB Atlas network access",
          diagnostics,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 6. بيانات الأدمن
    // ============================================
    const adminEmail = (ADMIN_EMAIL || "admin@designer.com").toLowerCase().trim();
    const adminPassword = ADMIN_PASSWORD || "Admin@123456";
    const adminName = ADMIN_NAME || "Admin";

    console.log(`[${requestId}] 📝 Admin email: ${adminEmail}`);

    // ============================================
    // 7. التحقق من وجود الأدمن
    // ============================================
    let existing;
    try {
      existing = await User.findOne({ email: adminEmail });
      console.log(`[${requestId}] 🔍 Existing user check:`, existing ? "FOUND" : "NOT FOUND");
    } catch (findError: any) {
      console.error(`[${requestId}] ❌ User.findOne failed:`, findError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to query database",
          details: findError?.message,
          diagnostics,
        },
        { status: 500 }
      );
    }

    if (existing) {
      console.log(`[${requestId}] ℹ️ Admin already exists`);
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        credentials: {
          email: existing.email,
          url: "/ar/admin/login",
        },
        hint: "Use your existing password. If forgotten, use /api/reset-admin to reset.",
        existingUserInfo: {
          createdAt: existing.createdAt,
          name: existing.name,
          role: existing.role,
        },
        diagnostics,
      });
    }

    // ============================================
    // 8. تشفير كلمة المرور
    // ============================================
    console.log(`[${requestId}] 🔐 Hashing password...`);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(adminPassword, 10);
    } catch (hashError: any) {
      console.error(`[${requestId}] ❌ bcrypt.hash failed:`, hashError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "Password hashing failed",
          details: hashError?.message,
          diagnostics,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 9. إنشاء الأدمن
    // ============================================
    console.log(`[${requestId}] 👤 Creating admin user...`);
    let admin;
    try {
      admin = await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "admin",
      });
      console.log(`[${requestId}] ✅ Admin created with ID: ${admin._id}`);
    } catch (createError: any) {
      console.error(`[${requestId}] ❌ User.create failed:`, createError?.message);
      console.error(`   Error name:`, createError?.name);
      if (createError?.code === 11000) {
        console.error(`   → Duplicate key error (user already exists)`);
      }
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create admin user",
          details: createError?.message,
          errorName: createError?.name,
          diagnostics,
        },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] 🎉 SUCCESS`);

    return NextResponse.json({
      success: true,
      message: "✅ Admin user created successfully",
      credentials: {
        email: adminEmail,
        password: adminPassword,
        url: "/ar/admin/login",
      },
      warning:
        "⚠️ Change password after first login, then delete this route for security.",
      userId: admin._id.toString(),
      diagnostics,
    });
  } catch (error: any) {
    console.error(`[${requestId}] ❌❌❌ UNEXPECTED ERROR ❌❌❌`);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error",
        errorName: error?.name,
        details: error?.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
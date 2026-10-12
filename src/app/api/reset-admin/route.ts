import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`\n🔄 [${requestId}] reset-admin request`);

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    const SETUP_KEY = process.env.ADMIN_SETUP_KEY;

    if (!SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "ADMIN_SETUP_KEY not configured",
          action: "Add it in Vercel → Settings → Environment Variables, then redeploy",
        },
        { status: 500 }
      );
    }

    if (!key || key !== SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: "Invalid setup key" },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] 🔌 Connecting to DB...`);
    await connectDB();

    // حذف جميع المستخدمين
    const deleted = await User.deleteMany({});
    console.log(`[${requestId}] 🗑️ Deleted ${deleted.deletedCount} users`);

    // بيانات جديدة
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@designer.com")
      .toLowerCase()
      .trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminName = process.env.ADMIN_NAME || "Admin";

    // إنشاء الأدمن الجديد
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "admin",
    });

    console.log(`[${requestId}] ✅ Admin reset complete: ${adminEmail}`);

    return NextResponse.json({
      success: true,
      message: "✅ Admin reset successfully",
      deletedUsers: deleted.deletedCount,
      credentials: {
        email: adminEmail,
        password: adminPassword,
        url: "/ar/admin/login",
      },
      warning:
        "⚠️ Save these credentials now. Change password after login, then delete this route.",
    });
  } catch (error: any) {
    console.error(`[${requestId}] ❌ Reset failed:`, error?.message);
    return NextResponse.json(
      {
        success: false,
        error: "Reset failed",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
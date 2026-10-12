import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken, setSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`\n🔐 [${requestId}] Login attempt`);

  try {
    const body = await request.json();
    console.log(`[${requestId}] Body:`, { email: body?.email, hasPassword: !!body?.password });

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      console.error(`[${requestId}] ❌ Validation failed:`, parsed.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "بيانات غير صحيحة / Invalid data",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // التحقق من قاعدة البيانات
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error(`[${requestId}] ❌ DB connection error:`, dbError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "خطأ في الاتصال بقاعدة البيانات / Database connection error",
          details: dbError?.message,
        },
        { status: 500 }
      );
    }

    // البحث عن المستخدم
    let user;
    try {
      user = await User.findOne({ email: normalizedEmail });
    } catch (findError: any) {
      console.error(`[${requestId}] ❌ User query failed:`, findError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "خطأ في البحث عن المستخدم / Query error",
          details: findError?.message,
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.warn(`[${requestId}] ⚠️ User not found: ${normalizedEmail}`);
      console.warn(`   → Check if admin was created via /api/setup-admin`);
      return NextResponse.json(
        {
          success: false,
          error: "البريد أو كلمة المرور غير صحيحة / Invalid credentials",
          hint: "User with this email does not exist. Make sure to create admin via /api/setup-admin",
        },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] ✅ User found: ${user.email} (role: ${user.role})`);

    // التحقق من كلمة المرور
    let isValid;
    try {
      isValid = await comparePassword(password, user.password);
    } catch (compareError: any) {
      console.error(`[${requestId}] ❌ Password comparison failed:`, compareError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "خطأ في التحقق من كلمة المرور / Verification error",
          details: compareError?.message,
        },
        { status: 500 }
      );
    }

    if (!isValid) {
      console.warn(`[${requestId}] ⚠️ Invalid password for: ${normalizedEmail}`);
      return NextResponse.json(
        {
          success: false,
          error: "البريد أو كلمة المرور غير صحيحة / Invalid credentials",
          hint: "Password does not match. Use /api/reset-admin if forgotten.",
        },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] ✅ Password valid, generating token...`);

    // إنشاء الـ token
    let token;
    try {
      token = await signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (tokenError: any) {
      console.error(`[${requestId}] ❌ Token generation failed:`, tokenError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "خطأ في إنشاء الجلسة / Token error",
          details: tokenError?.message,
          hint: "Check JWT_SECRET in Vercel environment variables",
        },
        { status: 500 }
      );
    }

    // حفظ الكوكي
    try {
      await setSessionCookie(token);
    } catch (cookieError: any) {
      console.error(`[${requestId}] ❌ Cookie set failed:`, cookieError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "خطأ في حفظ الجلسة / Cookie error",
          details: cookieError?.message,
        },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] 🎉 Login successful for ${user.email}`);

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(`[${requestId}] ❌❌❌ UNEXPECTED ERROR ❌❌❌`);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);

    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ في السيرفر / Server error",
        errorName: error?.name,
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
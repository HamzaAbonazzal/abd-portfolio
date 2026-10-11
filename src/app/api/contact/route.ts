import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // التحقق من المدخلات
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول مطلوبة / All fields are required" },
        { status: 400 }
      );
    }

    // التحقق من صيغة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني غير صالح / Invalid email" },
        { status: 400 }
      );
    }

    await connectDB();

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { success: true, message: "تم إرسال رسالتك بنجاح / Message sent successfully", id: newMessage._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في السيرفر / Server error" },
      { status: 500 }
    );
  }
}
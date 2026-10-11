import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    await connectDB();
    const query =
      filter === "read" ? { read: true } : filter === "unread" ? { read: false } : {};
    const messages = await Message.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(messages)) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
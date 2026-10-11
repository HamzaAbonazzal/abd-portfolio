import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Skill from "@/models/Skill";
import { requireAuth } from "@/lib/auth";

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  category: z.enum(["design", "tools", "soft"]),
  order: z.number().default(0),
  icon: z.string().optional().default(""),
});

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    await connectDB();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(skills)) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const skill = await Skill.create(parsed.data);
    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(skill)) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
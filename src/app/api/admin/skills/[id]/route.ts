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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const skill = await Skill.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!skill) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(skill)) });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
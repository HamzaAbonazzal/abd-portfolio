import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAuth } from "@/lib/auth";

const projectSchema = z.object({
  title: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  description: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  category: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  coverImage: z.string().min(1),
  tools: z.array(z.string()).default([]),
  liveUrl: z.string().optional().default(""),
  behanceUrl: z.string().optional().default(""),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(project)) });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const project = await Project.findByIdAndUpdate(id, parsed.data, { new: true }).lean();

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(project)) });
  } catch (error) {
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
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
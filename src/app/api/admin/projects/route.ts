import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAuth } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";

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

export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(projects)),
    });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    await connectDB();
    const project = await Project.create(parsed.data);

    // ✅ إبطال الذاكرة المؤقتة لتظهر البيانات الجديدة فوراً
    revalidateSite();

    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(project)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
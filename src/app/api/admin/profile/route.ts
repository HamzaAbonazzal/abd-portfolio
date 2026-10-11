import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import Profile from "@/models/Profile";
import { requireAuth } from "@/lib/auth";

const profileSchema = z.object({
  name: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  title: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  bio: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  avatar: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.object({ ar: z.string().min(1), en: z.string().min(1) }),
  socials: z.object({
    behance: z.string().optional().default(""),
    dribbble: z.string().optional().default(""),
    instagram: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
    twitter: z.string().optional().default(""),
  }),
  stats: z.object({
    experience: z.number().default(0),
    projects: z.number().default(0),
    clients: z.number().default(0),
    awards: z.number().default(0),
  }),
});

export async function PUT(request: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: parsed.error.issues },
        { status: 400 },
      );
    }

    await connectDB();

    // البحث عن أول profile أو إنشاء واحد
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(parsed.data);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, parsed.data, {
        new: true,
      }).lean();
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(profile)),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

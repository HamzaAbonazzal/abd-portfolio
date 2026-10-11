import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  // نستورد الملفات ديناميكياً بعد تحميل .env.local
  const connectDB = (await import("./db")).default;
  const Project = (await import("@/models/Project")).default;
  const Skill = (await import("@/models/Skill")).default;
  const Profile = (await import("@/models/Profile")).default;

  try {
    await connectDB();
    console.log("🌱 Seeding database...");

    // حذف البيانات القديمة
    await Promise.all([
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Profile.deleteMany({}),
    ]);

    // إضافة الملف الشخصي
    await Profile.create({
      name: { ar: "أحمد المصمم", en: "Ahmed Designer" },
      title: { ar: "مصمم واجهات وتجربة مستخدم", en: "UI/UX Designer" },
      bio: {
        ar: "مصمم شغوف بصناعة تجارب رقمية استثنائية. أحول الأفكار إلى تصاميم جذابة وسهلة الاستخدام.",
        en: "Passionate designer crafting exceptional digital experiences. I turn ideas into beautiful, usable designs.",
      },
      avatar: "/images/avatar.png",
      email: "hello@designer.com",
      phone: "+963999999999",
      location: { ar: "دمشق، سوريا", en: "Damascus, Syria" },
      socials: {
        behance: "https://behance.net/username",
        dribbble: "https://dribbble.com/username",
        instagram: "https://instagram.com/username",
        linkedin: "https://linkedin.com/in/username",
        twitter: "https://twitter.com/username",
      },
      stats: { experience: 5, projects: 50, clients: 30, awards: 8 },
    });

    // إضافة المهارات
    await Skill.insertMany([
      { name: "Figma", level: 95, category: "design", order: 1 },
      { name: "Adobe XD", level: 90, category: "design", order: 2 },
      { name: "Sketch", level: 85, category: "design", order: 3 },
      { name: "Wireframing", level: 92, category: "design", order: 4 },
      { name: "Prototyping", level: 88, category: "design", order: 5 },
      { name: "Adobe Photoshop", level: 90, category: "tools", order: 6 },
      { name: "Adobe Illustrator", level: 85, category: "tools", order: 7 },
      { name: "Framer", level: 80, category: "tools", order: 8 },
      { name: "Blender", level: 70, category: "tools", order: 9 },
    ]);

    // إضافة المشاريع
    await Project.insertMany([
      {
        title: { ar: "موقع شركة تقنية", en: "Tech Company Website" },
        description: {
          ar: "تصميم موقع كامل لشركة تقنية ناشئة مع هوية بصرية متكاملة.",
          en: "Full website design for a tech startup with complete brand identity.",
        },
        category: { ar: "تصميم مواقع", en: "Web Design" },
        coverImage: "/images/projects/project1.jpg",
        tools: ["Figma", "Photoshop"],
        featured: true,
        order: 1,
      },
      {
        title: { ar: "تطبيق موبايل للتوصيل", en: "Delivery Mobile App" },
        description: {
          ar: "تصميم واجهات تطبيق موبايل لخدمة توصيل الطعام.",
          en: "Mobile app UI design for a food delivery service.",
        },
        category: { ar: "تطبيقات موبايل", en: "Mobile Apps" },
        coverImage: "/images/projects/project2.jpg",
        tools: ["Figma", "Adobe XD"],
        featured: true,
        order: 2,
      },
      {
        title: { ar: "هوية بصرية لمقهى", en: "Coffee Shop Branding" },
        description: {
          ar: "تصميم هوية بصرية كاملة لمقهى محلي تشمل الشعار والألوان.",
          en: "Complete brand identity design for a local coffee shop.",
        },
        category: { ar: "هوية بصرية", en: "Branding" },
        coverImage: "/images/projects/project3.jpg",
        tools: ["Illustrator", "Photoshop"],
        featured: true,
        order: 3,
      },
      {
        title: { ar: "لوحة تحكم إدارية", en: "Admin Dashboard" },
        description: {
          ar: "تصميم لوحة تحكم احترافية لنظام إدارة محتوى.",
          en: "Professional admin dashboard design for a CMS.",
        },
        category: { ar: "تصميم واجهات", en: "UI Design" },
        coverImage: "/images/projects/project4.jpg",
        tools: ["Figma"],
        featured: false,
        order: 4,
      },
    ]);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
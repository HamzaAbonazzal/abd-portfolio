import { config } from "dotenv";
config({ path: ".env.local" });

async function seedAdmin() {
  const connectDB = (await import("./db")).default;
  const User = (await import("@/models/User")).default;
  const { hashPassword } = await import("./auth");

  try {
    await connectDB();
    console.log("🌱 Seeding admin user...");

    const adminEmail = "admin@designer.com";
    const adminPassword = "Admin@123456";

    // حذف المستخدمين القدامى (اختياري)
    // await User.deleteMany({});

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log("ℹ️  Admin user already exists:");
      console.log(`   Email: ${adminEmail}`);
      console.log("   (Use the same password you set before)");
      process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword);

    await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Change the password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedAdmin();
import connectDB from "./db";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Profile from "@/models/Profile";
import Message from "@/models/Message";
import User from "@/models/User";

export async function getProjects(featured?: boolean) {
  try {
    await connectDB();
    const query = featured ? { featured: true } : {};
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function getSkills(category?: string) {
  try {
    await connectDB();
    const query = category ? { category } : {};
    const skills = await Skill.find(query).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(skills));
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getProfile() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();
    if (!profile) return null;
    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getDashboardStats() {
  try {
    await connectDB();
    const [projectsCount, skillsCount, messagesCount, unreadCount] =
      await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
      ]);

    return {
      projects: projectsCount,
      skills: skillsCount,
      messages: messagesCount,
      unread: unreadCount,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { projects: 0, skills: 0, messages: 0, unread: 0 };
  }
}

export async function getRecentMessages(limit = 5) {
  try {
    await connectDB();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    return [];
  }
}
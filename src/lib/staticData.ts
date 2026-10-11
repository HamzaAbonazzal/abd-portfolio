export const staticProfile = {
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
};

export const staticSkills = [
  { name: "Figma", level: 95, category: "design" },
  { name: "Adobe XD", level: 90, category: "design" },
  { name: "Sketch", level: 85, category: "design" },
  { name: "Wireframing", level: 92, category: "design" },
  { name: "Prototyping", level: 88, category: "design" },
  { name: "User Research", level: 80, category: "design" },
];

export const staticTools = [
  { name: "Figma", key: "figma", color: "#F24E1E" },
  { name: "Photoshop", key: "photoshop", color: "#31A8FF" },
  { name: "Illustrator", key: "illustrator", color: "#FF9A00" },
  { name: "Adobe XD", key: "xd", color: "#FF61F6" },
  { name: "Framer", key: "framer", color: "#0055FF" },
  { name: "Sketch", key: "sketch", color: "#FDB300" },
  { name: "Blender", key: "blender", color: "#E87D0D" },
  { name: "Notion", key: "notion", color: "#FFFFFF" },
];

export const staticProjects = [
  {
    id: "1",
    title: { ar: "موقع شركة تقنية", en: "Tech Company Website" },
    description: {
      ar: "تصميم موقع كامل لشركة تقنية ناشئة مع هوية بصرية متكاملة.",
      en: "Full website design for a tech startup with complete brand identity.",
    },
    category: { ar: "تصميم مواقع", en: "Web Design" },
    coverImage: "/images/projects/project1.jpg",
    tools: ["Figma", "Photoshop"],
    featured: true,
    liveUrl: "#",
    behanceUrl: "#",
  },
  {
    id: "2",
    title: { ar: "تطبيق موبايل للتوصيل", en: "Delivery Mobile App" },
    description: {
      ar: "تصميم واجهات تطبيق موبايل لخدمة توصيل الطعام.",
      en: "Mobile app UI design for a food delivery service.",
    },
    category: { ar: "تطبيقات موبايل", en: "Mobile Apps" },
    coverImage: "/images/projects/project2.jpg",
    tools: ["Figma", "Adobe XD"],
    featured: true,
    liveUrl: "#",
    behanceUrl: "#",
  },
  {
    id: "3",
    title: { ar: "هوية بصرية لمقهى", en: "Coffee Shop Branding" },
    description: {
      ar: "تصميم هوية بصرية كاملة لمقهى محلي تشمل الشعار والألوان.",
      en: "Complete brand identity design for a local coffee shop.",
    },
    category: { ar: "هوية بصرية", en: "Branding" },
    coverImage: "/images/projects/project3.jpg",
    tools: ["Illustrator", "Photoshop"],
    featured: true,
    liveUrl: "#",
    behanceUrl: "#",
  },
  {
    id: "4",
    title: { ar: "لوحة تحكم إدارية", en: "Admin Dashboard" },
    description: {
      ar: "تصميم لوحة تحكم احترافية لنظام إدارة محتوى.",
      en: "Professional admin dashboard design for a CMS.",
    },
    category: { ar: "تصميم واجهات", en: "UI Design" },
    coverImage: "/images/projects/project4.jpg",
    tools: ["Figma"],
    featured: false,
    liveUrl: "#",
    behanceUrl: "#",
  },
];
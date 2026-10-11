"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { staticProjects } from "@/lib/staticData";

interface ProjectItem {
  _id?: string;
  id?: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: { ar: string; en: string };
  coverImage: string;
  tools: string[];
  featured: boolean;
  liveUrl?: string;
  behanceUrl?: string;
}

interface ProjectsProps {
  projects: ProjectItem[];
}

export default function Projects({ projects }: ProjectsProps) {
  const t = useTranslations("projects");
  const locale = useLocale() as "ar" | "en";
  const [filter, setFilter] = useState<string>("all");

  const data: ProjectItem[] =
    projects.length > 0 ? projects : (staticProjects as ProjectItem[]);

  const categories = [
    { key: "all", label: t("categories.all") },
    ...Array.from(
      new Map(
        data.map((p) => [
          p.category.en,
          { key: p.category.en, label: p.category[locale] },
        ])
      ).values()
    ),
  ];

  const filteredProjects =
    filter === "all"
      ? data
      : data.filter((p) => p.category.en === filter);

  return (
    <section id="projects" className="py-20 md:py-32 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-4">
            {t("title")}
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat.key
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-primary/50 hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id || project.id || index}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Cover Image Area */}
                <div className="relative h-56 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent overflow-hidden">
                  {project.coverImage && project.coverImage.trim() !== "" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.coverImage}
                      alt={project.title[locale]}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // إخفاء الصورة المعطوبة عند فشل التحميل
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary/40 select-none group-hover:scale-110 transition-transform duration-500">
                        {project.title[locale].charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay داكن لتحسين قراءة النصوص */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold shadow-lg z-10">
                      <Star className="w-3 h-3 fill-current" />
                      {t("featured")}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-medium z-10">
                    {project.category[locale]}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                    <a
                      href={project.liveUrl || project.behanceUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="View project"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
                    {project.title[locale]}
                  </h3>
                  <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-4 line-clamp-2">
                    {project.description[locale]}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-light-muted dark:text-dark-muted py-12">
            {t("noProjects")}
          </p>
        )}
      </div>
    </section>
  );
}
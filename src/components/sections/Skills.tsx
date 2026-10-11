"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { staticSkills } from "@/lib/staticData";

interface SkillItem {
  _id?: string;
  name: string;
  level: number;
  category?: string;
}

interface SkillsProps {
  skills: SkillItem[];
}

export default function Skills({ skills }: SkillsProps) {
  const t = useTranslations("skills");
  const data: SkillItem[] =
    skills.length > 0 ? skills : (staticSkills as SkillItem[]);

  return (
    <section id="skills" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-light-text dark:text-dark-text">
            {t("title")}
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          {data.map((skill, index) => (
            <motion.div
              key={skill._id || skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-light-text dark:text-dark-text">
                  {skill.name}
                </span>
                <span className="text-sm font-bold text-primary">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light shadow-lg shadow-primary/30"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
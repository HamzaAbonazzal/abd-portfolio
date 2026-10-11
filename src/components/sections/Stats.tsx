"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Briefcase, Users, Award, Layers } from "lucide-react";
import { staticProfile } from "@/lib/staticData";

interface StatsProps {
  profile: any;
}

export default function Stats({ profile }: StatsProps) {
  const t = useTranslations("stats");
  const data = profile || staticProfile;

  const stats = [
    { icon: Briefcase, value: data.stats?.experience || 0, label: t("experience"), suffix: "+" },
    { icon: Layers, value: data.stats?.projects || 0, label: t("projects"), suffix: "+" },
    { icon: Users, value: data.stats?.clients || 0, label: t("clients"), suffix: "+" },
    { icon: Award, value: data.stats?.awards || 0, label: t("awards"), suffix: "" },
  ];

  return (
    <section className="py-20 relative">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-light-card to-light-bg dark:from-dark-card dark:to-dark-bg border border-light-border dark:border-dark-border overflow-hidden group hover:border-primary/50 transition-all"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
                      {stat.value}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-sm text-light-muted dark:text-dark-muted">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
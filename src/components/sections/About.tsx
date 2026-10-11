"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Palette, Layers, Fingerprint, MousePointerClick } from "lucide-react";
import { staticProfile } from "@/lib/staticData";

export default function About() {
  const t = useTranslations("about");
  const locale = useLocale() as "ar" | "en";

  const services = [
    {
      icon: Palette,
      title: t("services.uiDesign.title"),
      desc: t("services.uiDesign.desc"),
    },
    {
      icon: Layers,
      title: t("services.uxDesign.title"),
      desc: t("services.uxDesign.desc"),
    },
    {
      icon: Fingerprint,
      title: t("services.branding.title"),
      desc: t("services.branding.desc"),
    },
    {
      icon: MousePointerClick,
      title: t("services.prototyping.title"),
      desc: t("services.prototyping.desc"),
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 relative">
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
          <h2 className="text-3xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-light-muted dark:text-dark-muted leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Heading + Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-4">
            {t("heading")}
          </h3>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">
                  {service.title}
                </h4>
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
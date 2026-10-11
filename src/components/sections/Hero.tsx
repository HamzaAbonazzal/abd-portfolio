"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, Download, Eye, Sparkles } from "lucide-react";
import { staticProfile } from "@/lib/staticData";

interface HeroProps {
  profile: any;
}

export default function Hero({ profile }: HeroProps) {
  const t = useTranslations("hero");
  const locale = useLocale() as "ar" | "en";

  // Fallback إذا كانت البيانات فارغة
  const data = profile || staticProfile;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>{t("availableForWork")}</span>
            </div>

            <p className="text-lg text-light-muted dark:text-dark-muted">
              {t("greeting")}
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-light-text dark:text-dark-text">
                {data.name[locale]}
              </span>
            </h1>

            <h2 className="text-2xl md:text-4xl font-bold">
              <span className="text-light-text dark:text-dark-text">
                {t("title")}{" "}
              </span>
              <span className="text-primary">{t("titleHighlight")}</span>
            </h2>

            <p className="text-lg text-light-muted dark:text-dark-muted max-w-lg leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
              >
                <Eye className="w-5 h-5" />
                {t("viewWork")}
              </a>
              <a
                href={data.socials?.behance || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                {t("downloadCV")}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary-light to-primary-dark blur-2xl opacity-60 animate-pulse" />
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-1 bg-gradient-to-br from-primary to-primary-dark shadow-2xl shadow-primary/40">
                <div className="w-full h-full rounded-full bg-light-bg dark:bg-dark-bg p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center border border-primary/20">
                    <span className="text-7xl md:text-9xl font-bold text-primary select-none">
                      {data.name[locale].charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-light-card dark:bg-dark-card border border-primary/30 shadow-2xl shadow-primary/20 whitespace-nowrap">
                <p className="text-sm font-semibold text-primary">
                  {data.title[locale]}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
  type="button"
  onClick={() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1 }}
  className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-light-muted dark:text-dark-muted hover:text-primary transition-colors cursor-pointer"
  aria-label={t("scrollDown")}
>
  <span className="text-xs">{t("scrollDown")}</span>
  <ArrowDown className="w-4 h-4 animate-bounce" />
</motion.button>
      </div>
    </section>
  );
}
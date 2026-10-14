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

  // ============================================
  // استخراج البيانات من الـ profile مع fallback آمن
  // ============================================
  const displayName = data?.name?.[locale] || staticProfile.name[locale];
  const displayTitle = data?.title?.[locale] || t("title");
  const displayBio = data?.bio?.[locale] || t("description");

  const handleScrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-center lg:text-start"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t("availableForWork")}</span>
            </div>

            {/* Greeting */}
            <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted">
              {t("greeting")}
            </p>

            {/* Name - from profile */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-light-text dark:text-dark-text">
                {displayName}
              </span>
            </h1>

            {/* Job Title - from profile */}
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                {displayTitle}
              </span>
            </h2>

            {/* Bio - from profile */}
            <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-lg leading-relaxed mx-auto lg:mx-0">
              {displayBio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-semibold transition shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("viewWork")}
              </a>
              <a
                href={data?.socials?.behance || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm sm:text-base font-semibold transition hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("downloadCV")}
              </a>
            </div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary-light to-primary-dark blur-2xl opacity-60 animate-pulse" />

              {/* Main circle */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full p-1 bg-gradient-to-br from-primary-deep via-primary to-primary-light shadow-2xl shadow-primary/40">
                <div className="w-full h-full rounded-full bg-light-bg dark:bg-dark-bg p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center border border-primary/20">
                    <span className="text-5xl sm:text-7xl md:text-9xl font-bold text-primary select-none">
                      {displayName.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating badge - Job Title from profile */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-light-card dark:bg-dark-card border border-primary/30 shadow-2xl shadow-primary/20 whitespace-nowrap max-w-[90vw]">
                <p className="text-xs sm:text-sm font-semibold text-primary truncate">
                  {displayTitle}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          type="button"
          onClick={handleScrollToAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-light-muted dark:text-dark-muted hover:text-primary transition-colors cursor-pointer group"
          aria-label={t("scrollDown")}
        >
          <span className="text-xs group-hover:translate-y-0.5 transition-transform">
            {t("scrollDown")}
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
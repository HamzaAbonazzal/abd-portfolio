"use client";

import { useLocale } from "next-intl";
import ThemeToggle from "@/components/layout/ThemeToggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
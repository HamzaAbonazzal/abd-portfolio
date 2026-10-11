"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    
    // استخراج المسار الحالي بدون البادئة اللغوية
    const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";
    
    // إعادة تحميل الصفحة بالكامل مع اللغة الجديدة
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <button
      onClick={toggleLocale}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-light-border dark:border-dark-border hover:bg-primary/10 transition gap-1 cursor-pointer"
      aria-label="Switch language"
      type="button"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-xs font-bold">
        {locale === "ar" ? "EN" : "ع"}
      </span>
    </button>
  );
}
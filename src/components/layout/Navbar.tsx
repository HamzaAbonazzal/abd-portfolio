"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/#about", label: t("about") },
    { href: "/#skills", label: t("skills") },
    { href: "/#projects", label: t("projects") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg border-b ${
        scrolled
          ? "bg-light-bg/80 dark:bg-dark-bg/80 border-light-border dark:border-dark-border shadow-lg shadow-black/5"
          : "bg-light-bg/60 dark:bg-dark-bg/60 border-transparent"
      }`}
    >
      <nav className="container h-16 md:h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-light-muted dark:text-dark-muted hover:text-primary hover:bg-primary/5 transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/#contact"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-lg shadow-primary/30"
          >
            {t("hireMe")}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-light-border dark:border-dark-border"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
          <ul className="container mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-light-text dark:text-dark-text hover:bg-primary/10 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="block px-4 py-3 rounded-lg bg-primary text-white text-center font-semibold"
              >
                {t("hireMe")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

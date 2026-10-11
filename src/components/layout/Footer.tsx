"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, Heart } from "lucide-react";
import Logo from "./Logo";
import { staticProfile } from "@/lib/staticData";

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale() as "ar" | "en";
  const data = profile || staticProfile;

  const quickLinks = [
    { href: "/", label: tNav("home") },
    { href: "/#about", label: tNav("about") },
    { href: "/#skills", label: tNav("skills") },
    { href: "/#projects", label: tNav("projects") },
    { href: "/#contact", label: tNav("contact") },
  ];

  const socials = [
    { name: "Behance", url: data.socials?.behance || "#" },
    { name: "Dribbble", url: data.socials?.dribbble || "#" },
    { name: "Instagram", url: data.socials?.instagram || "#" },
    { name: "LinkedIn", url: data.socials?.linkedin || "#" },
  ];

  return (
    <footer className="relative border-t border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Socials */}
          <div>
            <h4 className="text-sm font-bold text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">
              {t("followMe")}
            </h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted hover:text-primary transition"
                >
                  <Mail className="w-4 h-4" />
                  {data.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted hover:text-primary transition"
                >
                  <Phone className="w-4 h-4" />
                  {data.phone}
                </a>
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-white transition"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-light-border dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-light-muted dark:text-dark-muted">
            © {new Date().getFullYear()} {data.name[locale]}. {t("rights")}
          </p>
          <p className="text-sm text-light-muted dark:text-dark-muted flex items-center gap-1">
            {locale === "ar" ? "صُنع بـ" : "Made with"}
            <Heart className="w-4 h-4 text-primary fill-current" />
            {locale === "ar" ? "في دمشق" : "in Damascus"}
          </p>
        </div>
      </div>
    </footer>
  );
}
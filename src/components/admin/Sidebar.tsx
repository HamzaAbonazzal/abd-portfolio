"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  MessageSquare,
  User,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Palette,
} from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("admin.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { href: "/admin/projects", icon: FolderKanban, label: t("projects") },
    { href: "/admin/skills", icon: Wrench, label: t("skills") },
    { href: "/admin/messages", icon: MessageSquare, label: t("messages") },
    { href: "/admin/profile", icon: User, label: t("profile") },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-light-border dark:border-dark-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-light-text dark:text-dark-text">
              {t("adminPanel")}
            </p>
            <p className="text-xs text-light-muted dark:text-dark-muted">
              {locale === "ar" ? "لوحة التحكم" : "Control Panel"}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-light-muted dark:text-dark-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-light-border dark:border-dark-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-light-muted dark:text-dark-muted hover:bg-primary/10 hover:text-primary transition"
        >
          <ExternalLink className="w-5 h-5" />
          {t("viewSite")}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 rtl:left-auto rtl:right-4 z-50 w-10 h-10 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 z-40 w-72 bg-light-card dark:bg-dark-card border-r rtl:border-r-0 rtl:border-l border-light-border dark:border-dark-border flex flex-col transition-transform duration-300 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0"
        } left-0 rtl:left-auto rtl:right-0`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

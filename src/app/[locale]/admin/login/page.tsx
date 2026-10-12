"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/${locale}/admin/dashboard`);
        router.refresh();
      } else {
        setError(data.error || "فشل تسجيل الدخول");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-light-bg dark:bg-dark-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-deep via-primary to-primary-light shadow-lg shadow-primary/30 mb-4">
            <Palette className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text">
            {locale === "ar" ? "لوحة الإدارة" : "Admin Panel"}
          </h1>
          <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted mt-1">
            {locale === "ar" ? "تسجيل الدخول للمتابعة" : "Sign in to continue"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 md:p-8 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-xl space-y-4 sm:space-y-5"
        >
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-light-text dark:text-dark-text mb-2">
              {locale === "ar" ? "البريد الإلكتروني" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@designer.com"
                autoComplete="email"
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          </div>

          {/* Password with Show/Hide Toggle */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-light-text dark:text-dark-text mb-2">
              {locale === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 rtl:pl-12 rtl:pr-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              {/* زر إظهار/إخفاء كلمة المرور */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-light-muted dark:text-dark-muted hover:text-primary hover:bg-primary/10 transition"
                aria-label={
                  showPassword
                    ? locale === "ar" ? "إخفاء كلمة المرور" : "Hide password"
                    : locale === "ar" ? "إظهار كلمة المرور" : "Show password"
                }
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold transition shadow-lg shadow-primary/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {locale === "ar" ? "جارٍ الدخول..." : "Signing in..."}
              </>
            ) : (
              locale === "ar" ? "تسجيل الدخول" : "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-light-muted dark:text-dark-muted mt-6">
          © {new Date().getFullYear()} Designer Portfolio
        </p>
      </motion.div>
    </div>
  );
}
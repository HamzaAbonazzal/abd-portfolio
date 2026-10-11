"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Loader2, Save, X } from "lucide-react";

interface Props {
  initialData?: {
    _id?: string;
    name: string;
    level: number;
    category: "design" | "tools" | "soft";
    order: number;
  };
  onClose?: () => void;
}

export default function SkillForm({ initialData, onClose }: Props) {
  const t = useTranslations("admin.skills");
  const router = useRouter();
  const locale = useLocale();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    level: initialData?.level ?? 80,
    category: initialData?.category || "design",
    order: initialData?.order ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id
        ? `/api/admin/skills/${initialData._id}`
        : "/api/admin/skills";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        if (onClose) onClose();
        router.refresh();
      } else {
        setError(data.error || t("form.error"));
      }
    } catch {
      setError(t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
  const labelClass = "block text-sm font-medium text-light-text dark:text-dark-text mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>{t("form.name")}</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={t("form.namePlaceholder")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.level")}</label>
          <input
            type="number"
            min={0}
            max={100}
            required
            value={form.level}
            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("form.order")}</label>
          <input
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("form.category")}</label>
        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as "design" | "tools" | "soft" })
          }
          className={inputClass}
        >
          <option value="design">{t("categories.design")}</option>
          <option value="tools">{t("categories.tools")}</option>
          <option value="soft">{t("categories.soft")}</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("form.saving")}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t("form.save")}
            </>
          )}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-primary/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight } from "lucide-react";

interface ProjectFormData {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: { ar: string; en: string };
  coverImage: string;
  tools: string;
  liveUrl: string;
  behanceUrl: string;
  featured: boolean;
  order: number;
}

interface Props {
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

export default function ProjectForm({ initialData, projectId }: Props) {
  const t = useTranslations("admin.projects");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState<ProjectFormData>({
    title: initialData?.title || { ar: "", en: "" },
    description: initialData?.description || { ar: "", en: "" },
    category: initialData?.category || { ar: "", en: "" },
    coverImage: initialData?.coverImage || "",
    tools: initialData?.tools || "",
    liveUrl: initialData?.liveUrl || "",
    behanceUrl: initialData?.behanceUrl || "",
    featured: initialData?.featured || false,
    order: initialData?.order ?? 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      coverImage: form.coverImage,
      tools: form.tools
        .split(",")
        .map((tool) => tool.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl,
      behanceUrl: form.behanceUrl,
      featured: form.featured,
      order: Number(form.order),
    };

    try {
      const url = projectId
        ? `/api/admin/projects/${projectId}`
        : "/api/admin/projects";
      const method = projectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/${locale}/admin/projects`);
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
    "w-full px-4 py-3 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  const labelClass =
    "block text-sm font-medium text-light-text dark:text-dark-text mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.titleAr")}</label>
          <input
            type="text"
            required
            dir="rtl"
            value={form.title.ar}
            onChange={(e) =>
              setForm({ ...form, title: { ...form.title, ar: e.target.value } })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("form.titleEn")}</label>
          <input
            type="text"
            required
            dir="ltr"
            value={form.title.en}
            onChange={(e) =>
              setForm({ ...form, title: { ...form.title, en: e.target.value } })
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Category */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.categoryAr")}</label>
          <input
            type="text"
            required
            dir="rtl"
            value={form.category.ar}
            onChange={(e) =>
              setForm({ ...form, category: { ...form.category, ar: e.target.value } })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("form.categoryEn")}</label>
          <input
            type="text"
            required
            dir="ltr"
            value={form.category.en}
            onChange={(e) =>
              setForm({ ...form, category: { ...form.category, en: e.target.value } })
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.descAr")}</label>
          <textarea
            required
            rows={4}
            dir="rtl"
            value={form.description.ar}
            onChange={(e) =>
              setForm({ ...form, description: { ...form.description, ar: e.target.value } })
            }
            className={`${inputClass} resize-none`}
          />
        </div>
        <div>
          <label className={labelClass}>{t("form.descEn")}</label>
          <textarea
            required
            rows={4}
            dir="ltr"
            value={form.description.en}
            onChange={(e) =>
              setForm({ ...form, description: { ...form.description, en: e.target.value } })
            }
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className={labelClass}>{t("form.coverImage")}</label>
        <input
          type="text"
          required
          dir="ltr"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className={inputClass}
          placeholder="/images/projects/project1.jpg"
        />
        <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
          {t("form.coverImageHint")}
        </p>
      </div>

      {/* Tools */}
      <div>
        <label className={labelClass}>{t("form.tools")}</label>
        <input
          type="text"
          dir="ltr"
          value={form.tools}
          onChange={(e) => setForm({ ...form, tools: e.target.value })}
          className={inputClass}
          placeholder="Figma, Photoshop, Illustrator"
        />
        <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
          {t("form.toolsHint")}
        </p>
      </div>

      {/* URLs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.liveUrl")}</label>
          <input
            type="url"
            dir="ltr"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className={inputClass}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className={labelClass}>{t("form.behanceUrl")}</label>
          <input
            type="url"
            dir="ltr"
            value={form.behanceUrl}
            onChange={(e) => setForm({ ...form, behanceUrl: e.target.value })}
            className={inputClass}
            placeholder="https://behance.net/..."
          />
        </div>
      </div>

      {/* Order + Featured */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t("form.order")}</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className={inputClass}
            min={0}
          />
          <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
            {t("form.orderHint")}
          </p>
        </div>
        <div>
          <label className={labelClass}>{t("form.featured")}</label>
          <label className="flex items-center gap-3 p-4 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-sm text-light-text dark:text-dark-text">
              {t("form.featuredHint")}
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-light-border dark:border-dark-border">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold transition shadow-lg shadow-primary/30"
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
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-semibold hover:border-primary/50 transition"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          {t("form.cancel")}
        </button>
      </div>
    </form>
  );
}
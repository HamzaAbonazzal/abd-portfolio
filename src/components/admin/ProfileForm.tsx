"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

interface Props {
  initialData: any;
}

export default function ProfileForm({ initialData }: Props) {
  const t = useTranslations("admin.profile");
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name || { ar: "", en: "" },
    title: initialData?.title || { ar: "", en: "" },
    bio: initialData?.bio || { ar: "", en: "" },
    avatar: initialData?.avatar || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    location: initialData?.location || { ar: "", en: "" },
    socials: {
      behance: initialData?.socials?.behance || "",
      dribbble: initialData?.socials?.dribbble || "",
      instagram: initialData?.socials?.instagram || "",
      linkedin: initialData?.socials?.linkedin || "",
      twitter: initialData?.socials?.twitter || "",
    },
    stats: {
      experience: initialData?.stats?.experience ?? 0,
      projects: initialData?.stats?.projects ?? 0,
      clients: initialData?.stats?.clients ?? 0,
      awards: initialData?.stats?.awards ?? 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        router.refresh();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
  const labelClass =
    "block text-sm font-medium text-light-text dark:text-dark-text mb-2";
  const sectionClass =
    "p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border space-y-4";
  const sectionTitleClass =
    "text-lg font-bold text-light-text dark:text-dark-text mb-2 pb-2 border-b border-light-border dark:border-dark-border";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {status === "success" && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-sm">
          <CheckCircle2 className="w-5 h-5" />
          {t("form.success")}
        </div>
      )}
      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
          {t("form.error")}
        </div>
      )}

      {/* Basic Info */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t("sections.basic")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.nameAr")}</label>
            <input
              type="text"
              required
              dir="rtl"
              value={form.name.ar}
              onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.nameEn")}</label>
            <input
              type="text"
              required
              dir="ltr"
              value={form.name.en}
              onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.titleAr")}</label>
            <input
              type="text"
              required
              dir="rtl"
              value={form.title.ar}
              onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })}
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
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.bioAr")}</label>
            <textarea
              required
              rows={3}
              dir="rtl"
              value={form.bio.ar}
              onChange={(e) => setForm({ ...form, bio: { ...form.bio, ar: e.target.value } })}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.bioEn")}</label>
            <textarea
              required
              rows={3}
              dir="ltr"
              value={form.bio.en}
              onChange={(e) => setForm({ ...form, bio: { ...form.bio, en: e.target.value } })}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t("form.avatar")}</label>
          <input
            type="text"
            required
            dir="ltr"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            className={inputClass}
            placeholder="/images/avatar.png"
          />
        </div>
      </div>

      {/* Contact */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t("sections.contact")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.email")}</label>
            <input
              type="email"
              required
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.phone")}</label>
            <input
              type="tel"
              required
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.locationAr")}</label>
            <input
              type="text"
              required
              dir="rtl"
              value={form.location.ar}
              onChange={(e) =>
                setForm({ ...form, location: { ...form.location, ar: e.target.value } })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.locationEn")}</label>
            <input
              type="text"
              required
              dir="ltr"
              value={form.location.en}
              onChange={(e) =>
                setForm({ ...form, location: { ...form.location, en: e.target.value } })
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t("sections.socials")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(["behance", "dribbble", "instagram", "linkedin", "twitter"] as const).map((key) => (
            <div key={key}>
              <label className={labelClass}>{t(`form.${key}`)}</label>
              <input
                type="url"
                dir="ltr"
                value={form.socials[key]}
                onChange={(e) =>
                  setForm({ ...form, socials: { ...form.socials, [key]: e.target.value } })
                }
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t("sections.stats")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["experience", "projects", "clients", "awards"] as const).map((key) => (
            <div key={key}>
              <label className={labelClass}>{t(`form.${key}`)}</label>
              <input
                type="number"
                min={0}
                value={form.stats[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stats: { ...form.stats, [key]: Number(e.target.value) },
                  })
                }
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
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
    </form>
  );
}
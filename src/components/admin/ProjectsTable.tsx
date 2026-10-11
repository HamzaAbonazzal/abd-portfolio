"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, Loader2 } from "lucide-react";

interface Project {
  _id: string;
  title: { ar: string; en: string };
  category: { ar: string; en: string };
  tools: string[];
  featured: boolean;
  order: number;
  coverImage: string;
}

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const t = useTranslations("admin.projects");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("form.deleteConfirm"))) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || t("form.error"));
      }
    } catch {
      alert(t("form.error"));
    } finally {
      setDeleting(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-center">
        <p className="text-light-muted dark:text-dark-muted">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
            <tr>
              <th className="text-start px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase">
                {t("table.project")}
              </th>
              <th className="text-start px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase">
                {t("table.category")}
              </th>
              <th className="text-start px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase hidden md:table-cell">
                {t("table.tools")}
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase">
                {t("table.featured")}
              </th>
              <th className="text-center px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase hidden sm:table-cell">
                {t("table.order")}
              </th>
              <th className="text-end px-4 py-3 text-xs font-bold text-light-muted dark:text-dark-muted uppercase">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-primary/5 transition">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {project.title[locale]?.charAt(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-light-text dark:text-dark-text line-clamp-1">
                      {project.title[locale]}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium">
                    {project.category[locale]}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {project.tools.slice(0, 2).map((tool) => (
                      <span
                        key={tool}
                        className="text-xs px-2 py-0.5 rounded bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 2 && (
                      <span className="text-xs text-light-muted dark:text-dark-muted">
                        +{project.tools.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {project.featured ? (
                    <Star className="w-4 h-4 fill-primary text-primary inline" />
                  ) : (
                    <span className="text-light-muted dark:text-dark-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center hidden sm:table-cell">
                  <span className="text-sm text-light-muted dark:text-dark-muted">
                    {project.order}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project._id}/edit`}
                      className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deleting === project._id}
                      className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deleting === project._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
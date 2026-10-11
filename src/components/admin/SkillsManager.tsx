"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import SkillForm from "./SkillForm";

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: "design" | "tools" | "soft";
  order: number;
}

export default function SkillsManager({ skills }: { skills: Skill[] }) {
  const t = useTranslations("admin.skills");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("form.deleteConfirm"))) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) router.refresh();
      else alert(data.error || t("form.error"));
    } catch {
      alert(t("form.error"));
    } finally {
      setDeleting(null);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
            {t("list")}
          </h2>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            {skills.length} {t("table.name")}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-lg shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            {t("addNew")}
          </button>
        )}
      </div>

      {/* Form Modal */}
      {(showForm || editingSkill) && (
        <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border-2 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-light-text dark:text-dark-text">
              {editingSkill ? t("edit") : t("addNew")}
            </h3>
            <button onClick={handleClose} className="text-light-muted hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <SkillForm
            initialData={
              editingSkill
                ? {
                    _id: editingSkill._id,
                    name: editingSkill.name,
                    level: editingSkill.level,
                    category: editingSkill.category,
                    order: editingSkill.order,
                  }
                : undefined
            }
            onClose={handleClose}
          />
        </div>
      )}

      {/* List */}
      {skills.length === 0 ? (
        <div className="p-12 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-center">
          <p className="text-light-muted dark:text-dark-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="p-5 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary/50 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-light-text dark:text-dark-text truncate">
                    {skill.name}
                  </p>
                  <span className="text-xs text-light-muted dark:text-dark-muted">
                    {t(`categories.${skill.category}`)} • #{skill.order}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingSkill(skill);
                      setShowForm(false);
                    }}
                    className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    disabled={deleting === skill._id}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                  >
                    {deleting === skill._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Level Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-primary min-w-[40px] text-end">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
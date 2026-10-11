import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectsTable from "@/components/admin/ProjectsTable";
import { getProjects } from "@/lib/data";

export default async function AdminProjectsPage() {
  const t = await getTranslations("admin.projects");
  const projects = await getProjects();

  return (
    <>
      <AdminHeader title={t("title")} />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
              {t("list")}
            </h2>
            <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
              {projects.length} {t("table.project")}
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-lg shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            {t("addNew")}
          </Link>
        </div>

        {/* Table */}
        <ProjectsTable projects={projects} />
      </div>
    </>
  );
}